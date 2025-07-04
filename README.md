## [![npm version](https://img.shields.io/npm/v/@agentx-ai/apollo-io-mcp-server)](https://www.npmjs.com/package/@agentx-ai/apollo-io-mcp-server)

# Apollo.io MCP Server

A powerful Model Context Protocol (MCP) server implementation for seamless Apollo.io API integration, enabling AI assistants to interact with Apollo.io data for people and organization enrichment.

## Features

- **People Enrichment**: Enrich contact data with comprehensive information
- **Organization Enrichment**: Get detailed company information and insights
- **People Search**: Find people based on various criteria
- **Organization Search**: Discover companies matching specific criteria
- **Job Postings**: Access job postings for specific organizations
- **Email Discovery**: Get email addresses using Apollo.io person IDs
- **Company Employees**: Find employees of specific companies

## Installation

```bash
npm install @agentx-ai/apollo-io-mcp-server
```

## Test locally

```
npm install -g .
npx @modelcontextprotocol/inspector apollo-io-mcp-server
```

Then add `APOLLO_IO_API_KEY` in Environment Variable

## Available Tools

### 1. People Enrichment (`people_enrichment`)

Enrich contact data with comprehensive information.

**Parameters:**

- `first_name` (string): Person's first name
- `last_name` (string): Person's last name
- `email` (string): Person's email address
- `domain` (string): Company domain
- `organization_name` (string): Organization name
- `linkedin_url` (string): Person's LinkedIn profile URL

### 2. Organization Enrichment (`organization_enrichment`)

Get detailed company information and insights.

**Parameters:**

- `domain` (string): Company domain
- `name` (string): Company name

### 3. People Search (`people_search`)

Find people based on various criteria.

**Parameters:**

- `q_organization_domains_list` (array): List of organization domains to search within
- `person_titles` (array): List of job titles to search for
- `person_seniorities` (array): List of seniority levels to search for

### 4. Organization Search (`organization_search`)

Discover companies matching specific criteria.

**Parameters:**

- `q_organization_domains_list` (array): List of organization domains to search for
- `organization_locations` (array): List of organization locations to search for

### 5. Organization Job Postings (`organization_job_postings`)

Access job postings for specific organizations.

**Parameters:**

- `organization_id` (string, required): Apollo.io organization ID

### 6. Get Person Email (`get_person_email`)

Get email address for a person using their Apollo ID.

**Parameters:**

- `apollo_id` (string, required): Apollo.io person ID

### 7. Employees of Company (`employees_of_company`)

Find employees of a company using company name or website/LinkedIn URL.

**Parameters:**

- `company` (string, required): Company name
- `website_url` (string): Company website URL
- `linkedin_url` (string): Company LinkedIn URL

## License

MIT License - see [LICENSE](LICENSE) file for details.

## AgentX MCP

- [MCP Hub Website](https://www.agentx.so/mcp)
- [More open sourced MCP Servers](https://github.com/AgentX-ai/AgentX-mcp-servers)
