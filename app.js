const express = require('express');

const app = express();

app.use(express.json());

const todoTaskRouter = require('./routes/todoTaskRoute');
const userRouter = require('./routes/userRoute');

app.use('/api/v1/todotasks', todoTaskRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
