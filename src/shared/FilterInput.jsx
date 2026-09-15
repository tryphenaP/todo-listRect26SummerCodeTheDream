import { TODO_MAX_LENGTH } from '../utils/todoValidation.js';
import styles from './FilterInput.module.css';

function TodoFilter({ filterTerm, onFilterChange }) {
  return (
    <div className={styles.filter}>
      <label
        className={styles.label}
        htmlFor="filterInput"
      >
        Search tasks:
      </label>

      <input
        className={styles.input}
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search tasks by title..."
        maxLength={TODO_MAX_LENGTH}
        autoComplete="off"
      />
    </div>
  );
}

export default TodoFilter;