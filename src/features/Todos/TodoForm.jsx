import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import {isValidTodoTitle} from '../utils/todoValidation.js';

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
    
    
    <TextInputWithLabel
      type="text"
      elementId="todoTitle"
      labelText="Todo Title"
      value={workingTodoTitle}
     onChange={(e)=> setWorkingTodoTitle(e.target.value)}
     
    
    />
    <button disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
  </form>
);

}

export default TodoForm;