import styles from './FilterInput.module.css';

function TodoFilter({ filterTerm, onFilterChange }) {
  return (
    <div className={styles.filter}>
      <label
        className={styles.label}
        htmlFor="filterInput"
      >
        Search todos:
      </label>

      <input
        className={styles.input}
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) =>
          onFilterChange(e.target.value)
        }
        placeholder="Search by title..."
      />
    </div>
  );
}

export default TodoFilter;