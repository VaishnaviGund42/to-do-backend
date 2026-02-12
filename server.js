const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = path.join(__dirname, "data.json");

// Ensure file exists
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, "[]");
}

// Root Route
app.get("/", (req, res) => {
  res.send("Todo Backend is Running 🚀");
});

// Read Todos
const readTodos = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(data);
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
  res.json(readTodos());
});

// UPDATE TODO
app.put("/api/todos/:id", (req, res) => {
  try {
    let todos = readTodos();
    const id = parseInt(req.params.id);

    let found = false;

    todos = todos.map((todo) => {
      if (todo.id === id) {
        found = true;
        return { ...todo, ...req.body };
      }
      return todo;
    });

    if (!found) {
      return res.status(404).json({ error: "Todo not found" });
    }

    writeTodos(todos);
    res.json({ message: "Todo Updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// DELETE TODO
app.delete("/api/todos/:id", (req, res) => {
  try {
    let todos = readTodos();
    const id = parseInt(req.params.id);

    const newTodos = todos.filter((todo) => todo.id !== id);

    if (newTodos.length === todos.length) {
      return res.status(404).json({ error: "Todo not found" });
    }

    writeTodos(newTodos);
    res.json({ message: "Todo Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
