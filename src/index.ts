#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ApolloServer } from "./apollo-server.js";

export async function serve(): Promise<void> {
  const server = new ApolloServer();
  await server.connect(new StdioServerTransport());
}

// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  serve().catch(console.error);
}
