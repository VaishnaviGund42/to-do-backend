const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./data.json";

app.get("/", (req, res) => {
  res.send("Todo Backend is Running 🚀");
});


// Read Todos
const readTodos = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf8");
    return data.trim() === "" ? [] : JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Write Todos
const writeTodos = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};


// CREATE TODO
app.post("/api/todos", (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: "Title is required" });
    }
    
    const todos = readTodos();

    const newTodo = {
      id: Date.now(),
      title: req.body.title,
      completed: false,
    };

    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
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
  try {
    let todos = readTodos();

    const id = parseInt(req.params.id);

    const initialLength = todos.length;
    todos = todos.filter((todo) => todo.id !== id);

    if (todos.length === initialLength) {
      return res.status(404).json({ error: "Todo not found" });
    }

    writeTodos(todos);

    res.json({ message: "Todo Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
