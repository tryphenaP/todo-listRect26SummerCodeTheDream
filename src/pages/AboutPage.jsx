
function AboutPage() {
  return (
    <div>
      <h1>About This Todo App</h1>

      <section>
        <h2>Features</h2>
        <ul>
          <li>Create new todos</li>
          <li>Edit existing todos</li>
          <li>Mark todos as completed</li>
          <li>Filter and sort tasks</li>
          <li>User authentication and protected pages</li>
          <li>Responsive and interactive user interface</li>
        </ul>
      </section>

      <section>
        <h2>Technologies Used</h2>
        <ul>
          <li>React</li>
          <li>React Router</li>
          <li>Vite</li>
          <li>JavaScript (ES6+)</li>
          <li>HTML5 & CSS3</li>
          <li>Fetch API</li>
        </ul>
      </section>

      <section>
        <h2>Purpose</h2>
        <p>
          This Todo application helps users organize and manage their tasks.
          Users can create, update, complete, filter, and sort todos while
          enjoying a modern React-based user experience.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;