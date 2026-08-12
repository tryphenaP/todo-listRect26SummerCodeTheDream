function TodoListItem({ todo, onCompleteTodo }) {
  return(
      <ul>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onCompleteTodo(todo.id)}
      />
      {todo.title}
  </ul>
  );
}

export default TodoListItem;