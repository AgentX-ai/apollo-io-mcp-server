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

- `domain` (string, required): The domain of the company that you want to enrich. Do not include www., the @ symbol, or similar (e.g., 'apollo.io' or 'microsoft.com')

### 3. People Search (`people_search`)

Find people based on various criteria with comprehensive filtering options.

**Parameters:**

- `person_titles` (array): Job titles held by the people you want to find (e.g., 'sales development representative', 'marketing manager', 'research analyst')
- `include_similar_titles` (boolean): Whether to include people with similar job titles (default: true)
- `q_keywords` (string): A string of words to filter the results
- `person_locations` (array): The location where people live (e.g., 'california', 'ireland', 'chicago')
- `person_seniorities` (array): Job seniority levels (e.g., 'owner', 'founder', 'c_suite', 'partner', 'vp', 'head', 'director', 'manager', 'senior', 'entry', 'intern')
- `organization_locations` (array): The location of the company headquarters for a person's current employer (e.g., 'texas', 'tokyo', 'spain')
- `q_organization_domains_list` (array): The domain name for the person's employer (e.g., 'apollo.io', 'microsoft.com')
- `contact_email_status` (array): Email statuses to filter by (e.g., 'verified', 'unverified', 'likely to engage', 'unavailable')
- `organization_ids` (array): Apollo IDs for specific companies (employers) to include in search results
- `organization_num_employees_ranges` (array): Employee count ranges for the person's current company (e.g., '1,10', '250,500', '10000,20000')
- `revenue_range` (object): Revenue range for the person's current employer
  - `min` (integer): Minimum revenue the person's current employer generates (no currency symbols, commas, or decimals)
  - `max` (integer): Maximum revenue the person's current employer generates (no currency symbols, commas, or decimals)
- `currently_using_all_of_technology_uids` (array): Find people based on ALL technologies their current employer uses (use underscores for spaces, e.g., 'salesforce', 'google_analytics', 'wordpress_org')
- `currently_using_any_of_technology_uids` (array): Find people based on ANY of the technologies their current employer uses (use underscores for spaces, e.g., 'salesforce', 'google_analytics', 'wordpress_org')
- `currently_not_using_any_of_technology_uids` (array): Exclude people based on technologies their current employer uses (use underscores for spaces, e.g., 'salesforce', 'google_analytics', 'wordpress_org')
- `q_organization_job_titles` (array): Job titles listed in active job postings at the person's current employer (e.g., 'sales manager', 'research analyst')
- `organization_job_locations` (array): Locations of jobs being actively recruited by the person's employer (e.g., 'atlanta', 'japan')
- `organization_num_jobs_range` (object): Range for number of job postings active at the person's current employer
  - `min` (integer): Minimum number of active job postings at the person's current employer
  - `max` (integer): Maximum number of active job postings at the person's current employer
- `organization_job_posted_at_range` (object): Date range for when jobs were posted by the person's current employer
  - `min` (string): Earliest date when jobs were posted by the person's current employer (YYYY-MM-DD)
  - `max` (string): Latest date when jobs were posted by the person's current employer (YYYY-MM-DD)
- `page` (integer): Page number for pagination (default: 1)
- `per_page` (integer): Number of results per page (max: 100, default: 25)

### 4. Organization Search (`organization_search`)

Discover companies matching specific criteria with comprehensive filtering options.

**Parameters:**

- `q_organization_domains_list` (array): List of organization domains to search for
- `organization_locations` (array): The location of the company headquarters (e.g., 'texas', 'tokyo', 'spain')
- `organization_not_locations` (array): Exclude companies from search results based on location (e.g., 'minnesota', 'ireland', 'seoul')
- `organization_num_employees_ranges` (array): Employee count ranges with upper and lower numbers separated by comma (e.g., '1,10', '250,500', '10000,20000')
- `revenue_range` (object): Search for organizations based on their revenue range
  - `min` (integer): Minimum revenue amount (no currency symbols, commas, or decimals)
  - `max` (integer): Maximum revenue amount (no currency symbols, commas, or decimals)
- `currently_using_any_of_technology_uids` (array): Technologies the organization currently uses (use underscores for spaces, e.g., 'salesforce', 'google_analytics', 'wordpress_org')
- `q_organization_keyword_tags` (array): Filter search results based on keywords associated with companies (e.g., 'mining', 'sales strategy', 'consulting')
- `q_organization_name` (string): Filter search results to include a specific company name (partial matches accepted)
- `organization_ids` (array): Apollo IDs for specific companies to include in search results
- `latest_funding_amount_range` (object): Funding amount range for the company's most recent funding round
  - `min` (integer): Minimum amount from most recent funding round (no currency symbols, commas, or decimals)
  - `max` (integer): Maximum amount from most recent funding round (no currency symbols, commas, or decimals)
- `total_funding_range` (object): Total funding amount range across all funding rounds
  - `min` (integer): Minimum total funding amount across all rounds (no currency symbols, commas, or decimals)
  - `max` (integer): Maximum total funding amount across all rounds (no currency symbols, commas, or decimals)
- `latest_funding_date_range` (object): Date range for when the company received its most recent funding round
  - `min` (string): Earliest date of most recent funding round (YYYY-MM-DD)
  - `max` (string): Latest date of most recent funding round (YYYY-MM-DD)
- `q_organization_job_titles` (array): Job titles listed in active job postings at the company (e.g., 'sales manager', 'research analyst')
- `organization_job_locations` (array): Locations of jobs being actively recruited by the company (e.g., 'atlanta', 'japan')
- `organization_num_jobs_range` (object): Range for number of job postings active at the company
  - `min` (integer): Minimum number of active job postings at the company
  - `max` (integer): Maximum number of active job postings at the company
- `organization_job_posted_at_range` (object): Date range for when jobs were posted by the company
  - `min` (string): Earliest date when jobs were posted by the company (YYYY-MM-DD)
  - `max` (string): Latest date when jobs were posted by the company (YYYY-MM-DD)
- `page` (integer): Page number for pagination (default: 1)
- `per_page` (integer): Number of results per page (max: 100, default: 25)

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
