"use client";

import { useState, useEffect } from "react";
import TodoList from "./Todolist";
import { useQuery } from "@apollo/client";
import { GET_TODOS ,ADD_TODO} from "../graphql/queries";
import { useMutation } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";


const Board = () => {
  const { data, loading, error } = useQuery(GET_TODOS, {
    fetchPolicy: 'cache-and-network',
  });  
  const [todos, setTodos] = useState<{ id:number , status: string }[]>([]);
  const [newTask, setNewTask] = useState("");

  const [addTodo, { loading: creating, error: createError }] = useMutation(ADD_TODO, {
    update(cache, { data: { addTodo } }) {

      const existingTodos = cache.readQuery<{ getTodos: { id: number, status: string }[] }>({ query: GET_TODOS });
      if (existingTodos && existingTodos.getTodos) {
        cache.writeQuery({
          query: GET_TODOS,
          data: {
            getTodos: [...existingTodos.getTodos, addTodo],
          },
        });
      }
    },
  });

  useEffect(() => {
    if (data) {
      setTodos(data.getTodos);
    }
  }, [data]);

  const handleAddTodo = () => {
    if (newTask.trim()) {
      addTodo({
        variables: {
          text: newTask,
        },
      })
        .then(() => setNewTask(""))
        .catch((err) => console.error("Error creating todo:", err));
    }
  };


  // const handleAddTodo = () => {
  //   if (newTask.trim()) {
  //     addTodo({
  //       variables: { text: newTask },
  //       optimisticResponse: {
  //         __typename: 'Mutation',
  //         addTodo: {
  //           __typename: 'Todo',
  //           id: Math.random().toString(),
  //           text: newTask,
  //           status: 'todo',
  //         },
  //       },
  //     })
  //       .then(() => setNewTask(''))
  //       .catch((err) => console.error('Error creating todo:', err));
  //   }
  // };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="board">
      <div className="column todo" data-status="todo">
        <h3>To Do</h3>
        <TodoList todos={todos.filter(todo => todo.status === "todo")} />
        <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTodo} disabled={creating}>
          {creating ? "Creating..." : "Add Task"}
        </button>
        {createError && <p>Error creating task: {createError.message}</p>}
      </div>
      </div>
      <div className="column in-progress" data-status="progress">
        <h3 className="color-in-progress">In Progress</h3>
        <TodoList todos={todos.filter(todo =>  todo.status === "progress")} />
      </div>
      <div className="column done" data-status="done">
        <h3 className="color-done">Done</h3>
        <TodoList todos={todos.filter(todo => todo.status === "done")}/>
      </div>
    </div>
  );
};

export default Board;
