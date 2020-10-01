const express = require('express');

const router = express.Router();

const db = require('./userDb');

router.post('/', validateUser, (req, res) => {
  res.status(201).json(req.data);
});

router.post('/:id/posts', validateUserId, (req, res) => {
  
});

router.get('/', (req, res) => {
  db
  .get()
  .then(data => {
    if(!data) {
      return  res.status(404).json({ messageError: 'Cannot find user data.' });
    }

    res.status(200).json(data);
  })
  .catch(err => {
    res.status(500).json({ messageError: 'Cannot get users data.' });
  });
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.data);
});

router.get('/:id/posts', validateUserId, validatePost, (req, res) => {
  res.status(200).json(req.data);
});

router.delete('/:id', validateUserId, (req, res) => {
  db
  .remove(parseInt(req.params.id), req.body)
  .then(data => {
    if(!data) {
      return res.status(400).json({ errorMessage: "Cannot delete user." });
    }

    res.status(202).json(req.data);
  })
  .catch(err => {
    res.status(500).json({ errorMessage: 'Cannot delete user data.' });
  })
});

router.put('/:id', validateUserId, (req, res) => {
  if(!req.body || !req.body.name) {
    return res.status(401).json({ errorMessage: 'Missing required data.' });
  }

  db
  .update(parseInt(req.params.id), req.body)
  .then(data => {
    if(!data) {
      res.status(400).json({ errorMessage: "Can't update user." });
    }
    res.status(202).json(req.data);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

//custom middleware

function validateUserId(req, res, next) {
  db
  .getById(parseInt(req.params.id))
  .then(data => {
      if(!data) {
        return res.status(404).json({ errorMessage: 'Cannot find user with specified ID' });
      }

      req.data = data;
      next();
    }
  )
  .catch(err => {
    return res.status(400).json({ errorMessage: 'Cannot get user data.' });
  })
}

function validateUser(req, res, next) {
  if(!req.body) {
    return res.status(400).json({ errorMessage: 'missing required name field' });
  }

  if(!req.body.name) {
    return res.status(400).json({ errorMessage: 'Missing required text field' });
  }

  db
  .insert(req.body)
  .then(data => {
    req.data = data;
    next();
  })
  .catch(err => {
    res.status(500).json({ errorMessage: 'Cannot post data' });
  })
}

function validatePost(req, res, next) {
  db
  .getUserPosts(parseInt(req.params.id))
  .then(data => {
    req.data = data;
    next();
  })
  .catch(err => {
    res.status(500).json({ errorMessage: 'Cannot get posts from user' });
  })
}

module.exports = router;
