"use client"; // ทำให้ component นี้เป็น Client Component

import { ApolloProvider as Provider } from "@apollo/client";
import client from "../lib/apollo-client";

export default function ApolloProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={client}>{children}</Provider>;
}
