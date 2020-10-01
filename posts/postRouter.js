const express = require('express');

const router = express.Router();

const db = require('./postDb');

router.get('/', (req, res) => {
  db
  .get()
  .then(data => {
    if(!data) {
      return res.status(404).json({ messageError: 'Cannot find users'});
    }

    res.status(200).json(data);
  })
  .catch(err => {
    res.status(500).json({ messageError: 'Cannot get user data.'});
  })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.data);
});

router.delete('/:id', validatePostId, (req, res) => {
  db
  .remove(parseInt(req.params.id))
  .then(data => {
    res.status(202).json(req.data);
  })
  .catch(err => {
    res.status(500).json({ messageError: 'Cannot delete user data.' });
  })
});

router.put('/:id', validatePostId, (req, res) => {
  if(!req.body || !req.body.text ) {
    return res.status(400).json({ messageError: 'Missing required data.' });
  }

  db
  .update(parseInt(req.params.id), req.body)
  .then(data => {
    res.status(202).json(req.data);
  })
  .catch(err => {
    res.status(500).json({ messageError: 'Cannot delete user data.' });
  })
});

// custom middleware

function validatePostId(req, res, next) {
  db
  .getById(parseInt(req.params.id))
  .then(data => {
    if(!data) {
      return res.status(404).json({ messageError: 'No posts found with specified ID.' })
    }

    req.data = data;
    next();
  })
  .catch(err => {
    res.status(500).json({ messageError: 'Unspecified error with server.' });
  })
}

module.exports = router;
