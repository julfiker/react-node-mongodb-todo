/* eslint-disable no-console */
const express = require('express');
const { v4: generateId } = require('uuid');
//const database = require('./database');

const app = express();

const Todo = require("./Todo")

function requestLogger(req, res, next) {
  res.once('finish', () => {
    const log = [req.method, req.path];
    if (req.body && Object.keys(req.body).length > 0) {
      log.push(JSON.stringify(req.body));
    }
    log.push('->', res.statusCode);
    console.log(log.join(' '));
  });
  next();
}

app.use(requestLogger);
app.use(require('cors')());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const response = await Todo.find({});
  res.status(200);
  res.json(response);
});

app.post('/', async (req, res) => {
  let todo = new Todo(req.body);

  if (typeof todo.text !== 'string') {
    res.status(400);
    res.json({ message: "invalid 'text' expected string" });
    return;
  }

  todo.completed = false;
  todo.save(function(err) {
    console.log(err);
  });

  // const tds = database.client.db('todos').collection('todos');
  // let total = tds.find().sort({id: -1}).limit(1);
  //
  //  const id = total.length === 0 ? 1 : Number(total[0].id) + 1;
  //
  // const todo = { id: id, text, completed: false };
  // await database.client.db('todos').collection('todos').insertOne(todo);
  res.status(201);
  const todos = await Todo.find({});
  res.json(todos);
});

app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    res.status(400);
    res.json({ message: "invalid 'completed' expected boolean" });
    return;
  }

  Todo.findOneAndUpdate({'id':id}, {'completed': completed}, function(err, doc) {
    if (err)
      return res.send(500, {error: err});

    res.status(200);
    res.end();
  });

});

app.delete('/:id', async (req, res) => {
  const { id } = req.params;
  Todo.find({ id }).remove().exec();
  res.status(203);
  res.end();
});

module.exports = app;
