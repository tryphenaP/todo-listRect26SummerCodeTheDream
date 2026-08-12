function TodoListItem({ todo, onCompleteTodo }) {
  return(
      <li>
    <form>
        {isEditing ? (
            <TextInputWithLabel value={todo.title}/>
        ) : (
            <>
                <label>
                    <input
                        type="checkbox"
                        id={`checkbox${todo.id}`}
                        checked={todo.isCompleted}
                        onChange={() => onCompleteTodo(todo.id)}
                    />
                </label>
                <span onClick={() => setIsEditing(true)}>{todo.title}</span>
            </>
        )}
    </form>
</li>
  );
}

export default TodoListItem;