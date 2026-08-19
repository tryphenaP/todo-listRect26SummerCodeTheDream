import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';
import { useEditableTitle } from '../../hooks/useEditableTitle.js';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const { isEditing, workingTitle, startEditing, cancelEdit, updateTitle, finishEdit } = useEditableTitle(todo.title);

  

const handleUpdate = (event) => {
  if (!isEditing) return;
  event.preventDefault();
  const finalTitle = finishEdit();
  if (!isValidTodoTitle(finalTitle)) return;
  onUpdateTodo({ ...todo, title: finalTitle });
  cancelEdit();
};


  return(
     <li>
    <form onSubmit={handleUpdate}>
        {isEditing ? (
            <TextInputWithLabel value={workingTitle} 
            onChange={e => updateTitle(e.target.value)}
            elementId={`todoTitle${todo.id}`}
              labelText="Todo Title" 
            
            />
            
            
        ) : (
            <>
                <label>
                    <input
                        type="checkbox"
                        id={`checkbox${todo.id}`}
                        checked={todo.isCompleted}
                        onChange={() => onCompleteTodo(todo.id)}
                         
                         
                    />
                </label>
                <span onClick={() => startEditing()}>{todo.title}</span>
            </>
        )}<button type="button" onClick={cancelEdit}>
          Cancel
        </button>
        <button type="submit" disabled={!isValidTodoTitle(workingTitle)}>
          Update
        </button>
    </form>
</li>
  );
}

export default TodoListItem;