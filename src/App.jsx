import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import './App.css'
import { useState } from "react";


function App() {
  const [todoList, setTodoList] = useState([]);
   function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    };
    setTodoList(previous => [newTodo, ...previous]);
  
   }
function completeTodo(todoId) {
  setTodoList(previous => previous.map(todo => {
    if (todo.id === todoId) {
      return { ...todo,  isCompleted: true};
    }
    return todo;
  }));
} 
  return (
    <div>
      <h1>Todo List</h1>
      
          <TodoList todoList={todoList}
          onCompleteTodo={completeTodo}/>
          <TodoForm onAddTodo={addTodo} />

     
    </div>
            
  )
}

export default App