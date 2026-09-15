import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import {
  isValidTodoTitle,
  sanitizeText,
  TODO_MAX_LENGTH,
} from '../../../utils/todoValidation.js';
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

    const sanitizedTitle = sanitizeText(workingTitle);

    if (!isValidTodoTitle(sanitizedTitle)) return;

    onUpdateTodo({
      ...todo,
      title: sanitizedTitle,
    });

    finishEdit();
  };

  const isTaskComplete = todo.isCompleted || todo.completed || todo.isComplete || todo.status === 'completed';

  return (
    <li className={styles.todoItem}>
      {isEditing ? (
        <form
          className={styles.editForm}
          onSubmit={handleUpdate}
        >
          <TextInputWithLabel
            elementId={`edit-todo-${todo.id}`}
            labelText="Edit task"
            value={workingTitle}
            onChange={(e) => updateTitle(e.target.value)}
            maxLength={TODO_MAX_LENGTH}
            placeholder="Edit task title..."
            required
          />

          <button
            type="button"
            className={styles.button}
            onClick={cancelEdit}
            aria-label="Cancel editing task"
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.button}
            disabled={!isValidTodoTitle(workingTitle)}
            aria-label="Save changes to task"
          >
            Update
          </button>
        </form>
      ) : (
        <div className={styles.todoContent}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={isTaskComplete}
            onChange={() => onCompleteTodo(todo.id)}
            aria-label={`Mark "${todo.title}" as ${
              isTaskComplete ? 'active' : 'completed'
            }`}
          />

          <span
            className={
              isTaskComplete
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
            aria-label={`Edit task "${todo.title}"`}
          >
            Edit
          </button>
        </div>
      )}
    </li>
  );
}

export default TodoListItem;
