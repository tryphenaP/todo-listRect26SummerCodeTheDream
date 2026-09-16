import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';
import { useEditableTitle } from '../../hooks/useEditableTitle.js';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const { isEditing, workingTitle, startEditing, cancelEdit, updateTitle, finishEdit } = useEditableTitle(todo.title);

  

const handleUpdate = (event) => {
  if (!isEditing) return;

  event.preventDefault();

  if (!isValidTodoTitle(workingTitle)) return;

  onUpdateTodo({ ...todo, title: workingTitle });

  finishEdit();
};



  return (
  <li>
    {isEditing ? (
      <form onSubmit={handleUpdate}>
        <TextInputWithLabel
          label="Edit todo"
          value={workingTitle}
          onChange={updateTitle}
        />
        <button type="button" onClick={cancelEdit}>
          Cancel
        </button>
        <button type="submit">
          Update
        </button>
      </form>
    ) : (
      <form>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onCompleteTodo(todo.id)}
        />
        <span>{todo.title}</span>
        <button type="button" onClick={startEditing}>
          Edit
        </button>
      </form>
    )}
     </li>
);
  
}

export default TodoListItem;