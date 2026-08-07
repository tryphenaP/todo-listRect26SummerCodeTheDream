import { useRef } from 'react';
import { useState } from 'react';

function TodoForm({ onAddTodo }) {
const inputRef = useRef();
const [workingTodo, setWorkingTodo] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

  
    // .trim prevents whitespace only todos
    const todoTitle = workingTodo.trim() ;
    if (todoTitle ) {
      onAddTodo(todoTitle);
      setWorkingTodo("");
      inputRef.current.focus();
    }
  };
  return (
  <form onSubmit={handleAddTodo}>
    <label htmlFor="todoTitle">Todo</label>
    <input
      ref={inputRef}
      type="text"
      id="todoTitle"
      placeholder={'Todo text'}
      required
      value={workingTodo}
      onChange={(e) => setWorkingTodo(e.target.value)}
    />
    <button type="submit" disabled={!workingTodo.trim()}>
      Add Todo
    </button>
  </form>
);

}

export default TodoForm;