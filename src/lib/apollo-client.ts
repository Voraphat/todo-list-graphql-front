import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:9999/graphql", // ใช้ URL ของ backend
  cache: new InMemoryCache(),
});

export default client;
