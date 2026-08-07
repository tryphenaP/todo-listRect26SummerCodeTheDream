import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import './App.css'
import { useState } from "react";

const todos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
]
function App() {
  const [todoList, setTodoList] = useState([]);
   function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle
    };
    setTodoList(previous => [newTodo, ...previous]);
  
   }

  return (
    <div>
      <h1>Todo List</h1>
      
          <TodoList todoList={todoList}/>
          <TodoForm onAddTodo={addTodo} />

     
    </div>
            
  )
}

export default App