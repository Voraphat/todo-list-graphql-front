"use client";
import { useEffect, useRef,useCallback } from "react";
import { useMutation } from '@apollo/client';
import { TOGGLE_TODO , DELETE_TODO,GET_TODOS } from "../graphql/queries";
import { useQuery } from "@apollo/client";

type Todo = {
    id: number;
    text: string;
    status: string;
  };

  type TodoListProps = {
    todos: Todo[];
  };

const TodoList = ({ todos}: TodoListProps) => {
  const todoRef = useRef<HTMLDivElement | null>(null);

const [toggleTodo , {loading, error }] = useMutation(TOGGLE_TODO);
const [deleteTodo ] = useMutation(DELETE_TODO);
const { data } = useQuery(GET_TODOS);

  const handleStatusChange = (id: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    updateTodoStatus(id, newStatus);
  };


  const updateTodoStatus = (id: number, newStatus: string) => {
    toggleTodo({
        variables: { id: id, status: newStatus }
      })
      .then((response) => {
        // console.log('Todo updated:', response.data.toggleTodo);
      })
      .catch((err) => {
        console.error('Error updating todo:', err);
      });
  };

  const handleDragOver = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: any) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData("todoId");
    const newStatus = e.target.closest('.column')?.dataset.status;
    if (todoId && newStatus) {
      updateTodoStatus(todoId, newStatus);
    }
  }, []);

  useEffect(() => {
    const todoList = todoRef.current;
    if (todoList) {
      todoList.addEventListener("dragover", handleDragOver);
      todoList.addEventListener("drop", handleDrop);
    }
  
    return () => {
      if (todoList) {
        todoList.removeEventListener("dragover", handleDragOver);
        todoList.removeEventListener("drop", handleDrop);
      }
    };
  }, [handleDrop, handleDragOver]);

  const deleteTask = (id: number) => {
    deleteTodo({
      variables: { id: String(id) },
      update(cache) {
            const existingTodos = cache.readQuery<{ getTodos: { id: number, status: string }[] }>({
              query: GET_TODOS,
            });
            if (existingTodos && existingTodos.getTodos) {
              const updatedTodos = existingTodos.getTodos.filter(todo => todo.id !== id);
              cache.writeQuery({
                query: GET_TODOS,
                data: {
                  getTodos: updatedTodos,
                },
              });
            }
          },
        })
      .then((response) => {
        console.log("Todo deleted:", response.data.deleteTodo);
      })
      .catch((err) => {
        console.error("Error deleting todo:", err);
      });
  };
  
  


  

  return (
    <div ref={todoRef} className="todo-list" data-status="todo">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="todo-item flex justify-between"
          draggable
          onDragStart={(e) => e.dataTransfer.setData("todoId", todo.id.toString())}
        > 
        <div className="flex">
        <div className="bank">{todo.text}</div>
          <select
            value={todo.status}
            onChange={(e) => handleStatusChange(todo.id, e)}
            className="status-dropdown ellipsis"
          >
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
        <button  onClick={() => deleteTask(todo.id)}>
            X
        </button>
        </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
