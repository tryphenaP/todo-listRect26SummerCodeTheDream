//contains all   todo-related functionalitiesimport TodoList from '/src/features/Todos/TodoList/TodoList.jsx';
import TodoForm from '/src/features/Todos/TodoForm.jsx';
import '/src/App.css'
import {  useEffect, useState } from "react";


function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
  async function fetchTodos() {
    setIsTodoListLoading(true);

    try {
      const response = await fetch('/api/tasks?limit=100', {
        method: 'GET',
        headers: {
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (response.status === 401) {
        throw new Error('unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await response.json();

      setTodoList(data.tasks);

    } catch (error) {
      setError(`Error: ${error.name} | ${error.message}`);
    } finally {
      setIsTodoListLoading(false);
    }
  }

  fetchTodos();
}, [token]);

   async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    };
    setTodoList(previous => [newTodo, ...previous]);

    try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({
        title: newTodo.title,
        isCompleted: newTodo.isCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
    }

    const data = await response.json();

    // Replace temporary todo with real todo from server
    setTodoList((previous) =>
      previous.map((todo) =>
        todo.id === newTodo.id ? data.task : todo
      )
    );

  } catch (error) {      
    setTodoList((previous) =>
      previous.filter((todo) => todo.id !== newTodo.id)
    );

    
    setError(error.message);
  }   
  
   }


   async function completeTodo(todoId) {
    const originalTodo = todoList.find(
    (todo) => todo.id === todoId
  );
  if (!originalTodo) return;

  setTodoList((previous) =>
    previous.map((todo) =>
      todo.id === todoId
        ? { ...todo, isCompleted: true }
        : todo
    )
  );


try {
    const response = await fetch(`/api/tasks/${todoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({
        isCompleted: true,
        
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to complete todo');
    }

  } catch (error) {

setTodoList((previous) =>
      previous.map((todo) => {
        if (todo.id === todoId) {
          return originalTodo;
        }

        return todo;
      })
    );

    // Set error message
    setError(error.message);
  }
  
} 




async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
    (todo) => todo.id === editedTodo.id
  );

if (!originalTodo) return;

  setTodoList((previous) =>
    previous.map((todo) =>
      todo.id === editedTodo.id
        ? { ...todo, title: editedTodo.title }
        : todo
    )
  );

  try {
    // 3. PATCH request to API
    const response = await fetch(`/api/tasks/${editedTodo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({
        title: editedTodo.title,
        
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
} catch (error) {

    // 4. Rollback to original todo on failure
    setTodoList((previous) =>
  previous.map((todo) =>
    todo.id === originalTodo.id
      ? originalTodo
      : todo
  )
);

    // 5. Set error message
    setError(error.message);
  }
} 



  return (
    <div>
      <h1>Todo List</h1>
      {isTodoListLoading && (
      <p>Loading todos...</p>
    )}
      {error && (
      <div style={{ color: "red", marginBottom: "10px" }}>
        <p>{error}</p>

        <button onClick={() => setError('')}>
          Clear Error
        </button>
      </div>
    )}
          <TodoForm onAddTodo={addTodo} />
          <TodoList todoList={todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          />
          

     
    </div>
            
  )
}

export default TodosPage