import { useEffect, useReducer, useCallback } from 'react';
import { useSearchParams } from 'react-router';

import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';

import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import StatusFilter from '../shared/StatusFilter.jsx';

import useDebounce from '../utils/useDebounce.js';
import { useAuth } from '../contexts/AuthContext';


import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer.js';

import styles from './TodosPage.module.css';


function TodosPage() {
  const { token } = useAuth();

  // Status filter is stored in the URL.
  const [searchParams] = useSearchParams();

  const statusFilter =
    searchParams.get('status') || 'all';

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

  const debouncedFilterTerm =
    useDebounce(filterTerm, 300);

  /*
   * Changing dataVersion causes the fetch effect
   * to run again and get the latest data.
   */
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

  /*
   * Fetch todos whenever authentication,
   * sorting, searching, or dataVersion changes.
   */
  useEffect(() => {
    async function fetchTodos() {
      if (!token) {
        return;
      }

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

    fetchTodos();
  }, [
    token,
    sortBy,
    sortDirection,
    debouncedFilterTerm,
    dataVersion,
  ]);

  /*
   * ADD TODO
   */
  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    // Optimistically add the todo.
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: newTodo,
    });

    try {
      const response = await fetch(
        '/api/tasks',
        {
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
        }
      );

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

      // Refresh data after successful mutation.
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
   * COMPLETE TODO
   */
  async function completeTodo(todoId) {
    const originalTodo = todoList.find(
      (todo) => todo?.id === todoId
    );

    if (!originalTodo) {
      return;
    }

    // Optimistically mark as completed.
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        id: todoId,
      },
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

      // Refresh after successful update.
      invalidateCache();
    } catch (error) {
      // Restore original todo if request fails.
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
   * UPDATE TODO
   */
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      (todo) =>
        todo?.id === editedTodo.id
    );

    if (!originalTodo) {
      return;
    }

    // Optimistically update the todo.
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

      // Refresh after successful update.
      invalidateCache();
    } catch (error) {
      // Restore original todo if request fails.
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
  <main className={styles.todosPage}>
    <h1 className={styles.title}>
      Todo List
    </h1>

    {isTodoListLoading && (
      <p className={styles.loading}>
        Loading todos...
      </p>
    )}

    {error && (
      <div className={styles.error}>
        <p className={styles.errorMessage}>
          {typeof error === 'string'
            ? error
            : error?.message}
        </p>

        <button
          className={styles.errorButton}
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
      <div className={styles.filterError}>
        <p className={styles.errorMessage}>
          {typeof filterError === 'string'
            ? filterError
            : filterError?.message}
        </p>

        <button
          className={styles.errorButton}
          onClick={() =>
            dispatch({
              type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
            })
          }
        >
          Clear Filter Error
        </button>
      </div>
    )}

    <div className={styles.controls}>
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

      <StatusFilter />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />
    </div>

    <TodoList
      todoList={todoList}
      statusFilter={statusFilter}
      dataVersion={dataVersion}
      onCompleteTodo={completeTodo}
      onUpdateTodo={updateTodo}
    />
  </main>
);
}

export default TodosPage;