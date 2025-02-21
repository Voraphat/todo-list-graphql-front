import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      text
      status
    }
  }
`;

export const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      status
    }
  }
`;

export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!, $status: String!) {
    toggleTodo(id: $id, status: $status) {
      id
      status
    }
  }
`;


export const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
      text
    }
  }
`;


