import TodoList from '/src/features/Todos/TodoList/TodoList.jsx';
import TodoForm from '/src/features/Todos/TodoForm.jsx';
import SortBy from '/src/shared/SortBy.jsx';
import useDebounce from '/src/utils/useDebounce.js';
import FilterInput from '/src/shared/FilterInput.jsx';
import '/src/App.css'
import {  useEffect, useState , useCallback } from "react";


function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState('');

  const invalidateCache = useCallback(() => {
    console.log('Invalidating memo cache after todo mutation');
    setDataVersion((prev) => prev + 1);
  }, []);

  const handleFilterChange = (newTerm) => {
  setFilterTerm(newTerm);
};

  useEffect(() => {
  async function fetchTodos() {
    setIsTodoListLoading(true);

    try {
      const paramsObject = {
       sortBy,
       sortDirection,
       limit: 100,
      };

      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
       }
      const params = new URLSearchParams(paramsObject);

      const response = await fetch(`/api/tasks?${params}`, {
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
      setFilterError('');
      setError('');
      setFetchError('');

    } catch (error) {
      if (
    debouncedFilterTerm ||
    sortBy !== 'createdAt' ||
    sortDirection !== 'desc'
  ) {
    setFilterError(
      `Error filtering/sorting todos: ${error.message}`
    );
  } else {
    setError(`Error fetching todos: ${error.message}`);
  }
    } finally {
      setIsTodoListLoading(false);
    }
  }

  fetchTodos();
}, [token, sortBy, sortDirection, debouncedFilterTerm]);

   async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    };
    setTodoList((previous) => [...previous, newTodo]);
  invalidateCache();

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
     invalidateCache();
  } catch (error) {      
    setTodoList((previous) =>
      previous.filter((todo) => todo.id !== newTodo.id)
    );
invalidateCache();
    
    setFetchError(error.message);
  }   
  
   }


   async function completeTodo(todoId) {
    const originalTodo = todoList.find(
    (todo) => todo.id === todoId
  );
  setTodoList(previous => previous.map(todo => {
    if (todo.id === todoId) {
      return { ...todo,  isCompleted: true};
    }
    return todo;
  }));
  invalidateCache();

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
invalidateCache();
    // Set error message
    setFetchError(error.message);
  }
  
} 




async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
    (todo) => todo.id === editedTodo.id
  );

const updatedTodos = todoList.map(todo => {
    if (todo.id === editedTodo.id) {
      return {
        ...editedTodo,
      };
    }
    return todo;
  });
  setTodoList(updatedTodos);
  invalidateCache();

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
        isCompleted: editedTodo.isCompleted,
       
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
} catch (error) {

    // 4. Rollback to original todo on failure
    const rolledBack = todoList.map((todo) => {
      if (todo.id === originalTodo.id) {
        return originalTodo;
      }
      return todo;
    });

    setTodoList(rolledBack);
    invalidateCache();

    // 5. Set error message
    setFetchError(error.message);
  }
} 



  return (
    <div>
      <h1>Todo List</h1>
      {isTodoListLoading && (
      <p>Loading todos...</p>
    )}
      {fetchError && (
      <div style={{ color: "red", marginBottom: "10px" }}>
        <p>{fetchError}</p>

        <button onClick={() => setFetchError('')}>
          Clear Error
        </button>
      </div>
    )}

     {error && (
  <div style={{ color: 'red', marginBottom: '10px' }}>
    <p>{error}</p>

    <button onClick={() => setError('')}>
      Clear Error
    </button>
  </div>
)}


    {filterError && (
  <div style={{ color: 'orange', marginBottom: '10px' }}>
    <p>{filterError}</p>

    <button onClick={() => setFilterError('')}>
      Clear Filter Error
    </button>

    <button
      onClick={() => {
        setFilterTerm('');
        setSortBy('createdAt');
        setSortDirection('desc');
        setFilterError('');
      }}
    >
      Reset Filters
    </button>
  </div>
)}
          

          <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy}onSortDirectionChange={setSortDirection}/>
          
          <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange}/>
          
          <TodoForm onAddTodo={addTodo} />
<TodoList todoList={todoList}
            dataVersion={dataVersion}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
          />
     
    </div>
            
  )
}

export default TodosPage