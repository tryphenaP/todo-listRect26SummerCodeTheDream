import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';
import { useEditableTitle } from '../../../hooks/useEditableTitle.js';
import styles from './TodoListItem.module.css';

function TodoListItem({
  todo,
  onCompleteTodo,
  onUpdateTodo,
}) {
  const {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit,
  } = useEditableTitle(todo.title);

  const handleUpdate = (event) => {
    if (!isEditing) return;

    event.preventDefault();

    if (!isValidTodoTitle(workingTitle)) return;

    onUpdateTodo({
      ...todo,
      title: workingTitle,
    });

    finishEdit();
  };

  return (
    <li className={styles.todoItem}>
      {isEditing ? (
        <form
          className={styles.editForm}
          onSubmit={handleUpdate}
        >
          <TextInputWithLabel
            elementId={`edit-todo-${todo.id}`}
            labelText="Edit todo"
            value={workingTitle}
            onChange={(e) => updateTitle(e.target.value)}
          />

          <button
            type="button"
            className={styles.button}
            onClick={cancelEdit}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.button}
          >
            Update
          </button>
        </form>
      ) : (
        <form className={styles.todoContent}>
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)}
          />

          <span
            className={
              todo.isCompleted
                ? `${styles.todoTitle} ${styles.completed}`
                : styles.todoTitle
            }
          >
            {todo.title}
          </span>

          <button
            type="button"
            className={styles.editButton}
            onClick={startEditing}
          >
            Edit
          </button>
        </form>
      )}
    </li>
  );
}

export default TodoListItem;