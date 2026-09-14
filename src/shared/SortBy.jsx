import styles from './SortBy.module.css';

function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div className={styles.sortBy}>
      <div className={styles.sortOption}>
        <label
          className={styles.label}
          htmlFor="sort-by"
        >
          Sort by
        </label>

        <select
          className={styles.select}
          id="sort-by"
          value={sortBy}
          onChange={(e) =>
            onSortByChange(e.target.value)
          }
        >
          <option value="createdAt">
            Creation Date
          </option>

          <option value="title">
            Title
          </option>
        </select>
      </div>

      <div className={styles.sortOption}>
        <label
          className={styles.label}
          htmlFor="sort-direction"
        >
          Order
        </label>

        <select
          className={styles.select}
          id="sort-direction"
          value={sortDirection}
          onChange={(e) =>
            onSortDirectionChange(e.target.value)
          }
        >
          <option value="desc">
            Descending
          </option>

          <option value="asc">
            Ascending
          </option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;