import TodoList from '/src/features/Todos/TodoList/TodoList.jsx';
import TodoForm from '/src/features/Todos/TodoForm.jsx';
import SortBy from '/src/shared/SortBy.jsx';
import FilterInput from '/src/shared/FilterInput.jsx';
import useDebounce from '/src/utils/useDebounce.js';
import '/src/App.css';
import { useAuth } from '/src/contexts/AuthContext';

import { useEffect, useReducer, useCallback } from 'react';

import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '/src/reducers/todoReducer.js';

function TodosPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(
    todoReducer,
    initialTodoState
  );

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;


  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const invalidateCache = useCallback(() => {
    dispatch({
      type: TODO_ACTIONS.INCREMENT_DATA_VERSION,
    });
  }, []);

  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: newTerm,
    });
  };

  useEffect(() => {
    async function fetchTodos() {
      dispatch({
        type: TODO_ACTIONS.FETCH_START,
      });

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
        };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(
          `/api/tasks?${params}`,
          {
            method: 'GET',
            headers: {
              'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch todos'
          );
        }

        const data = await response.json();

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: data.tasks,
        });
      } catch (error) {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
    message: `Error fetching todos: ${error.message}`,
    isFilterError: false,
  },
        });
      }
    }

    fetchTodos();
  }, [
    token,
    sortBy,
    sortDirection,
    debouncedFilterTerm,
  ]);

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: newTodo,
    });

    invalidateCache();

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: todoTitle,
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error(
          'Failed to add todo'
        );
      }

      const data = await response.json();

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          tempId: newTodo.id,
          task: data.task,
        },
      });

      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: error.message,
      });
    }
  }

  async function completeTodo(todoId) {
    const originalTodo = todoList.find(
      (todo) => todo?.id === todoId
    );

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: originalTodo,
    });

    invalidateCache();

    try {
      const response = await fetch(
        `/api/tasks/${todoId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            isCompleted: true,
            
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to complete todo'
        );
      }

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: todoId,
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: originalTodo,
      });

      dispatch({
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: {
    message: `Error fetching todos: ${error.message}`,
    isFilterError: false,
  },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      (todo) =>
        todo?.id === editedTodo.id
    );

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: editedTodo,
    });

    invalidateCache();

    try {
      const response = await fetch(
        `/api/tasks/${editedTodo.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: editedTodo.title,
            isCompleted:
              editedTodo.isCompleted,
            
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to update todo'
        );
      }
     const data = await response.json();
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: data.task,
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: originalTodo,
      });

      dispatch({
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: {
    message: `Error fetching todos: ${error.message}`,
    isFilterError: false,
  },
      });
    }
  }

  return (
    <div>
      <h1>Todo List</h1>

      {isTodoListLoading && (
        <p>Loading todos...</p>
      )}

      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '10px',
          }}
        >
<p>{typeof error === "string" ? error : error?.message}</p>
          <button
            onClick={() =>
              dispatch({
                type:
                  TODO_ACTIONS.CLEAR_ERROR,
              })
            }
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div
          style={{
            color: 'orange',
            marginBottom: '10px',
          }}
        >
          <p>{filterError}</p>

          <button
            onClick={() =>
              dispatch({
                type:
                  TODO_ACTIONS.CLEAR_FILTER_ERROR,
              })
            }
          >
            Clear Filter Error
          </button>
        </div>
      )}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(value) =>
          dispatch({
            type:
              TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: value,
              sortDirection,
            },
          })
        }
        onSortDirectionChange={(
          value
        ) =>
          dispatch({
            type:
              TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy,
              sortDirection: value,
            },
          })
        }
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={
          handleFilterChange
        }
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;