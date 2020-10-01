const express = require('express');
const morgan = require('morgan');
const server = express();
const port = 5000;

const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

server.use(express.json());
server.use(morgan('combined'));

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

server.listen(port, () => console.log(`Server started on port: ${port}...`));