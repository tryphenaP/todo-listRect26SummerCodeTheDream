
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

  const debouncedFilterTerm = useDebounce(
    filterTerm,
    300
  );

  /*
   * Increment dataVersion after a successful
   * todo mutation.
   *
   * dataVersion is included in the fetch effect,
   * so this causes the todo list to refresh.
   */
  const invalidateCache = useCallback(() => {
    dispatch({
      type: TODO_ACTIONS.INCREMENT_DATA_VERSION,
    });
  }, []);

  /*
   * Handle filter changes.
   *
   * Clear any previous filter error when the
   * user changes the filter.
   */
  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: newTerm,
    });

    dispatch({
      type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
    });
  };

  
  useEffect(() => {
    async function fetchTodos() {
      dispatch({
        type: TODO_ACTIONS.FETCH_START,
      });

      try {
        const paramsObject = {
          limit: '100',
          sortBy,
          sortDirection,
        };

        if (debouncedFilterTerm.trim()) {
          paramsObject.find =
            debouncedFilterTerm.trim();
        }

        const params = new URLSearchParams(
          paramsObject
        );

        const response = await fetch(
          `/api/tasks?${params.toString()}`,
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
            isFilterError:
              Boolean(debouncedFilterTerm.trim()),
          },
        });
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [
    token,
    sortBy,
    sortDirection,
    debouncedFilterTerm,
    dataVersion,
  ]);

  /*
   * Add Todo
   */
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

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        payload: {
          message: error.message,
          id: newTodo.id,
        },
      });
    }
  }

  /*
   * Complete Todo
   */
  async function completeTodo(todoId) {
    const originalTodo = todoList.find(
      (todo) => todo?.id === todoId
    );

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: originalTodo,
    });

    try {
      const response = await fetch(
        `/api/tasks/${todoId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
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

      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          message: error.message,
          todo: originalTodo,
        },
      });
    }
  }

  /*
   * Update Todo
   */
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      (todo) =>
        todo?.id === editedTodo.id
    );

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: editedTodo,
    });

    try {
      const response = await fetch(
        `/api/tasks/${editedTodo.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
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

      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          message: error.message,
          todo: originalTodo,
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
          <p>
            {typeof error === 'string'
              ? error
              : error?.message}
          </p>

          <button
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
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
          <p>
            {typeof filterError === 'string'
              ? filterError
              : filterError?.message}
          </p>

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
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: value,
              sortDirection,
            },
          })
        }
        onSortDirectionChange={(value) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy,
              sortDirection: value,
            },
          })
        }
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
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
