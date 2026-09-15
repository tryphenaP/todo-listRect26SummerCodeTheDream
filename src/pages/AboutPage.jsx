import styles from './AboutPage.module.css';

function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <div className={styles.aboutCard}>
        <h1 className={styles.title}>About This Todo App</h1>

        <section className={styles.section}>
          <h2 className={styles.heading}>Features</h2>
          <ul className={styles.list}>
            <li>Create new todos</li>
            <li>Edit existing todos</li>
            <li>Mark todos as completed</li>
            <li>Filter and sort tasks</li>
            <li>User authentication and protected pages</li>
            <li>Responsive and interactive user interface</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Technologies Used</h2>
          <ul className={styles.list}>
            <li>React</li>
            <li>React Router</li>
            <li>Vite</li>
            <li>JavaScript (ES6+)</li>
            <li>HTML5 & CSS3</li>
            <li>Fetch API</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Purpose</h2>
          <p className={styles.description}>
            This Todo application helps users organize and manage their
            tasks. Users can create, update, complete, filter, and sort
            todos while enjoying a modern React-based user experience.
          </p>
        </section>
      </div>
    </main>
  );
}

export default AboutPage;