import { useEffect, useReducer, useCallback } from 'react';
import { useSearchParams } from 'react-router';

import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';

import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import StatusFilter from '../shared/StatusFilter.jsx';

import useDebounce from '../utils/useDebounce.js';
import { useAuth } from '../hooks/useAuth.js';

import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer.js';

import styles from './TodosPage.module.css';

function TodosPage() {
  const { token } = useAuth();

  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

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
          paramsObject.find = debouncedFilterTerm.trim();
        }

        const params = new URLSearchParams(paramsObject);

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
          throw new Error('Server returned an unsuccessful status');
        }

        const data = await response.json();

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: data.tasks,
        });
      } catch {
        const isFilter = Boolean(debouncedFilterTerm.trim());
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilter
              ? 'Unable to filter tasks. Please try a different search term.'
              : 'Unable to load tasks at this time. Please check your connection and try again.',
            isFilterError: isFilter,
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
        throw new Error('Failed to create task');
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
    } catch {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          message: 'Unable to add task. Please check your connection and try again.',
          id: newTodo.id,
        },
      });
    }
  }

  async function completeTodo(todoId) {
    const originalTodo = todoList.find(
      (todo) => todo?.id === todoId
    );

    if (!originalTodo) {
      return;
    }

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
        throw new Error('Failed to complete task');
      }

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: todoId,
      });

      invalidateCache();
    } catch {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          message: 'Unable to complete task. Please try again.',
          todo: originalTodo,
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      (todo) => todo?.id === editedTodo.id
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
            isCompleted: editedTodo.isCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const data = await response.json();

      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: data.task,
      });

      invalidateCache();
    } catch {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          message: 'Unable to save task changes. Please try again.',
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
        <p className={styles.loading} role="status">
          Loading tasks...
        </p>
      )}

      {error && (
        <div className={styles.error} role="alert">
          <p className={styles.errorMessage}>
            {typeof error === 'string' ? error : error?.message}
          </p>

          <button
            className={styles.errorButton}
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
            }
            aria-label="Dismiss error message"
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div className={styles.filterError} role="alert">
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
            aria-label="Dismiss filter error message"
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