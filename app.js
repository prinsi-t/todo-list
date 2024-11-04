require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path")

const port = process.env.PORT;
const app = express();




// Middleware
app.set("view engine", "ejs"); // Set EJS as the templating engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 40000
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Schema and Model
const todoSchema = new mongoose.Schema({
  name: String,
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model("Todo", todoSchema);





// Routes
app.get("/", async (req, res) => {
    try {
      const foundTodos = await Todo.find({});
 
      res.render("list", { todos: foundTodos });
  
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching todos.");
    }
  });
  
  app.post("/", async (req, res) => {
    const todoName = req.body.newTodo;
    const newTodo = new Todo({
      name: todoName,
      completed: false
    });
  
    try {
      await newTodo.save();
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error saving new todo.");
    }
  });

  app.post('/complete', async (req, res) => {
    const todoId = req.body.checkbox;
    try {
        const todo = await Todo.findById(todoId);
        if (todo) {
            todo.completed = !todo.completed; // Toggle the completed status
            await todo.save();
            console.log(todo)
        }
        res.redirect('/');
    } catch (error) {
        console.log("Error toggling todo:", error);
        res.status(500).send("Error toggling todo.");
    }
});

  app.post("/delete", async (req, res) => { 
    const checkedTodoId = req.body.checkbox;
    
    try {
      await Todo.findByIdAndDelete(checkedTodoId);
      //console.log("Successfully deleted checked item.");
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error deleting todo.");
    }
});
// Start the server

app.listen(port, () => {
  console.log("Server started on port " + port);
});