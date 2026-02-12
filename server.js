const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./data.json";


// Read Todos
const readTodos = () => {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
};

// Write Todos
const writeTodos = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};


// CREATE TODO
app.post("/api/todos", (req, res) => {
  const todos = readTodos();

  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };

  todos.push(newTodo);
  writeTodos(todos);

  res.status(201).json(newTodo);
});


// GET ALL TODOS
app.get("/api/todos", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});


// UPDATE TODO
app.put("/api/todos/:id", (req, res) => {
  let todos = readTodos();

  const id = parseInt(req.params.id);

  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, ...req.body } : todo
  );

  writeTodos(todos);
  res.json({ message: "Todo Updated" });
});


// DELETE TODO
app.delete("/api/todos/:id", (req, res) => {
  let todos = readTodos();

  const id = parseInt(req.params.id);

  todos = todos.filter((todo) => todo.id !== id);

  writeTodos(todos);

  res.json({ message: "Todo Deleted" });
});


app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
