import { useState, useEffect } from "react";
import API from "../api";
import TodoItem from "../components/TodoItems";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    API.get("http://localhost:5000/api/todos")
      .then(res => setTodos(res.data))
      .catch(console.error);
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    const res = await API.post("http://localhost:5000/api/todos", { task, done: false });
    setTodos(prev => [...prev, res.data]);
    setTask("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>To-Do List</h2>
      <form onSubmit={addTodo}>
        <input value={task} onChange={e => setTask(e.target.value)} placeholder="New task" />
        <button>Add</button>
      </form>
      <ul>
        {todos.map(t => <TodoItem key={t.id} task={t.task} />)}
      </ul>
    </div>
  );
}
export default TodoList;
