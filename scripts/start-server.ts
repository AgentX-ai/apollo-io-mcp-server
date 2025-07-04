// Suppress url.parse() deprecation warnings
(process as any).noDeprecation = true;

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ApolloServer } from "../src/apollo-server.js";

export async function startServer(args: string[] = process.argv.slice(2)) {
  const server = new ApolloServer();
  await server.connect(new StdioServerTransport());

  return server;
}

startServer().catch((error) => {
  console.error("Error starting Apollo.io MCP server:", error);
  process.exit(1);
});
