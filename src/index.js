const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount (request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);
  if (user) {
    request.user = user;
    next();
  }
  return response
    .status(404)
    .json({ error: `User ${username} not found.` });
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const usernameExists = users.find(user => user.username === username);
  if (usernameExists) {
    return response
      .status(400)
      .json({ error: `Username ${username} already exists.` });
  }
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };
  users.push(newUser);
  return response
    .status(201)
    .json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  return response
    .status(200)
    .json(request.user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };
  request.user.todos.push(newTodo);
  return response
    .status(201)
    .json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const todo = request.user.todos.find(todo => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: 'Todo not found.' });
  }
  todo.title = title;
  todo.deadline = new Date(deadline);
  return response
    .status(200)
    .json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const todo = request.user.todos.find(todo => todo.id === id);
  if (!todo) {
    return response
      .status(404)
      .json({ error: 'Todo not found.' });
  }
  todo.done = true;
  return response
    .status(200)
    .json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const todo = request.user.todos.find(todo => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: 'Todo not found.' });
  }
  request.user.todos = request.user.todos.filter(todo => todo.id !== id);
  return response
    .status(204)
    .json({ message: 'Todo deleted.' });
});

module.exports = app;
