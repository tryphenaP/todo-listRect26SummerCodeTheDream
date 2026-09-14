import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import {
  isValidTodoTitle,
  sanitizeText,
  TODO_MAX_LENGTH,
} from '../../utils/todoValidation.js';
import styles from './TodoForm.module.css';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e) => {
    setWorkingTodoTitle(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleAddTodo = (event) => {
    event.preventDefault();

    const sanitizedTitle = sanitizeText(workingTodoTitle);

    if (!isValidTodoTitle(sanitizedTitle)) {
      setValidationError(
        `Task title is required and must not exceed ${TODO_MAX_LENGTH} characters.`
      );
      return;
    }

    onAddTodo(sanitizedTitle);
    setWorkingTodoTitle('');
    setValidationError('');
  };

  return (
    <div className={styles.formContainer}>
      <form
        className={styles.todoForm}
        onSubmit={handleAddTodo}
        noValidate
      >
        <div className={styles.inputWrapper}>
          <TextInputWithLabel
            elementId="todoTitle"
            labelText="Add a new task"
            value={workingTodoTitle}
            onChange={handleInputChange}
            placeholder="What needs to be done?"
            maxLength={TODO_MAX_LENGTH}
            required
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? 'todo-validation-error' : undefined}
          />
        </div>

        <button
          type="submit"
          className={styles.addButton}
          disabled={!workingTodoTitle.trim()}
          aria-label="Add task to list"
        >
          Add Todo
        </button>
      </form>

      {validationError && (
        <p
          id="todo-validation-error"
          className={styles.validationError}
          role="alert"
        >
          {validationError}
        </p>
      )}
    </div>
  );
}

export default TodoForm;