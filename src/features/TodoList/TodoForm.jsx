import { useState } from 'react';

function TodoForm({ onAddTodo }) {

const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

  
    // .trim prevents whitespace only todos
    const todoTitle = workingTodoTitle.trim() ;
    if (todoTitle ) {
      onAddTodo(todoTitle);
      setWorkingTodoTitle("");
      
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
      value={workingTodoTitle}
      onChange={(e) => setWorkingTodoTitle(e.target.value)}
    />
    <button type="submit" disabled={!workingTodoTitle.trim()}>
      Add Todo
    </button>
  </form>
);

}

export default TodoForm;