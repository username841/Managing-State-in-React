import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // Define initial state for a new task
  const initialTaskState = {
    name: '',
    description: '',
    completed: false,
  };

  // State hooks for tasks list, current task being edited, and editing mode
  const [tasks, setTasks] = useState([]); // Tasks list
  const [task, setTask] = useState(initialTaskState); // Current task being edited
  const [editing, setEditing] = useState(false); // Editing mode flag

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle input changes in the task form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  // Handle form submission (add or update task)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.name || !task.description) return;
    if (editing) {
      // Update task if editing mode is active
      const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
      setTasks(updatedTasks);
      setEditing(false); // Exit editing mode after update
    } else {
      // Add new task if not in editing mode
      setTasks([...tasks, { ...task, id: Date.now() }]);
    }
    setTask(initialTaskState); // Reset task form
  };

  // Set task data for editing when Edit button is clicked
  const handleEdit = (id) => {
    const selectedTask = tasks.find((task) => task.id === id);
    setTask(selectedTask);
    setEditing(true); // Enter editing mode
  };

  // Delete a task
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    }
  };

  // Toggle completion status of a task
  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-app">
      <h1>To-Do List</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields for task name and description */}
        <input
          type="text"
          placeholder="Task Name"
          name="name"
          value={task.name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Task Description"
          name="description"
          value={task.description}
          onChange={handleChange}
        />
        {/* Submit button text changes based on editing mode */}
        <button type="submit">{editing ? 'Update Task' : 'Add Task'}</button>
      </form>
      <ul>
        {/* Render each task as list item */}
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            {/* Clicking on task toggles completion status */}
            <span onClick={() => handleToggleComplete(task.id)}>
              {task.name} - {task.description}
            </span>
            {/* Edit and delete buttons */}
            <button onClick={() => handleEdit(task.id)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
