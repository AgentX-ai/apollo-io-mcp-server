import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { ApolloClient } from "./apollo-client.js";
import dotenv from "dotenv";
import { parseArgs } from "node:util";

// Load environment variables
dotenv.config();

// Parse command line arguments
const { values } = parseArgs({
  options: {
    "api-key": { type: "string" },
  },
});

// Initialize Apollo.io client
const apiKey = values["api-key"] || process.env.APOLLO_IO_API_KEY;
if (!apiKey) {
  throw new Error("APOLLO_IO_API_KEY environment variable is required");
}

export class ApolloServer {
  // Core server properties
  private server: Server;
  private apollo: ApolloClient;

  constructor() {
    this.server = new Server(
      {
        name: "apollo-io-manager",
        version: "1.0.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.apollo = new ApolloClient(apiKey);

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled rejection at:", promise, "reason:", reason);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      // Define available tools
      const tools: Tool[] = [
        {
          name: "people_enrichment",
          description:
            "Use the People Enrichment endpoint to enrich data for 1 person, at least one parameter is required.",
          inputSchema: {
            type: "object",
            properties: {
              first_name: {
                type: "string",
                description: "Person's first name",
              },
              last_name: {
                type: "string",
                description: "Person's last name",
              },
              email: {
                type: "string",
                description: "Person's email address",
              },
              domain: {
                type: "string",
                description: "Company domain",
              },
              organization_name: {
                type: "string",
                description: "Organization name",
              },
              linkedin_url: {
                type: "string",
                description: "Person's LinkedIn profile URL",
              },
            },
          },
        },
        {
          name: "organization_enrichment",
          description:
            "Use the Organization Enrichment endpoint to enrich data for 1 company",
          inputSchema: {
            type: "object",
            properties: {
              domain: {
                type: "string",
                description:
                  "The domain of the company that you want to enrich. Do not include www., the @ symbol, or similar (e.g., 'apollo.io' or 'microsoft.com')",
              },
            },
            required: ["domain"],
          },
        },
        {
          name: "people_search",
          description:
            "Use the People Search endpoint to find people with comprehensive filtering options, at least one parameter is required.",
          inputSchema: {
            type: "object",
            properties: {
              person_titles: {
                type: "array",
                items: { type: "string" },
                description:
                  "Job titles held by the people you want to find (e.g., 'sales development representative', 'marketing manager', 'research analyst')",
              },
              include_similar_titles: {
                type: "boolean",
                description:
                  "Whether to include people with similar job titles (default: true)",
              },
              q_keywords: {
                type: "string",
                description: "A string of words to filter the results",
              },
              person_locations: {
                type: "array",
                items: { type: "string" },
                description:
                  "The location where people live (e.g., 'california', 'ireland', 'chicago')",
              },
              person_seniorities: {
                type: "array",
                items: { type: "string" },
                description:
                  "Job seniority levels (e.g., 'owner', 'founder', 'c_suite', 'partner', 'vp', 'head', 'director', 'manager', 'senior', 'entry', 'intern')",
              },
              organization_locations: {
                type: "array",
                items: { type: "string" },
                description:
                  "The location of the company headquarters for a person's current employer (e.g., 'texas', 'tokyo', 'spain')",
              },
              q_organization_domains_list: {
                type: "array",
                items: { type: "string" },
                description:
                  "The domain name for the person's employer (e.g., 'apollo.io', 'microsoft.com')",
              },
              contact_email_status: {
                type: "array",
                items: { type: "string" },
                description:
                  "Email statuses to filter by (e.g., 'verified', 'unverified', 'likely to engage', 'unavailable')",
              },
              organization_ids: {
                type: "array",
                items: { type: "string" },
                description:
                  "Apollo IDs for specific companies (employers) to include in search results",
              },
              organization_num_employees_ranges: {
                type: "array",
                items: { type: "string" },
                description:
                  "Employee count ranges for the person's current company (e.g., '1,10', '250,500', '10000,20000')",
              },
              revenue_range: {
                type: "object",
                properties: {
                  min: {
                    type: "integer",
                    description:
                      "Minimum revenue the person's current employer generates (no currency symbols, commas, or decimals)",
                  },
                  max: {
                    type: "integer",
                    description:
                      "Maximum revenue the person's current employer generates (no currency symbols, commas, or decimals)",
                  },
                },
                description: "Revenue range for the person's current employer",
              },
              currently_using_all_of_technology_uids: {
                type: "array",
                items: { type: "string" },
                description:
                  "Find people based on ALL technologies their current employer uses (use underscores for spaces, e.g., 'salesforce', 'google_analytics', 'wordpress_org')",
              },
              currently_using_any_of_technology_uids: {
                type: "array",
                items: { type: "string" },
                description:
                  "Find people based on ANY of the technologies their current employer uses (use underscores for spaces, e.g., 'salesforce', 'google_analytics', 'wordpress_org')",
              },
              currently_not_using_any_of_technology_uids: {
                type: "array",
                items: { type: "string" },
                description:
                  "Exclude people based on technologies their current employer uses (use underscores for spaces, e.g., 'salesforce', 'google_analytics', 'wordpress_org')",
              },
              q_organization_job_titles: {
                type: "array",
                items: { type: "string" },
                description:
                  "Job titles listed in active job postings at the person's current employer (e.g., 'sales manager', 'research analyst')",
              },
              organization_job_locations: {
                type: "array",
                items: { type: "string" },
                description:
                  "Locations of jobs being actively recruited by the person's employer (e.g., 'atlanta', 'japan')",
              },
              organization_num_jobs_range: {
                type: "object",
                properties: {
                  min: {
                    type: "integer",
                    description:
                      "Minimum number of active job postings at the person's current employer",
                  },
                  max: {
                    type: "integer",
                    description:
                      "Maximum number of active job postings at the person's current employer",
                  },
                },
                description:
                  "Range for number of job postings active at the person's current employer",
              },
              organization_job_posted_at_range: {
                type: "object",
                properties: {
                  min: {
                    type: "string",
                    format: "date",
                    description:
                      "Earliest date when jobs were posted by the person's current employer (YYYY-MM-DD)",
                  },
                  max: {
                    type: "string",
                    format: "date",
                    description:
                      "Latest date when jobs were posted by the person's current employer (YYYY-MM-DD)",
                  },
                },
                description:
                  "Date range for when jobs were posted by the person's current employer",
              },
              page: {
                type: "integer",
                description: "Page number for pagination (default: 1)",
              },
              per_page: {
                type: "integer",
                description:
                  "Number of results per page (max: 100, default: 25)",
              },
            },
          },
        },
        {
          name: "organization_search",
          description:
            "Use the Organization Search endpoint to find organizations with comprehensive filtering options, at least one parameter is required.",
          inputSchema: {
            type: "object",
            properties: {
              q_organization_domains_list: {
                type: "array",
                items: { type: "string" },
                description: "List of organization domains to search for",
              },
              organization_locations: {
                type: "array",
                items: { type: "string" },
                description:
                  "The location of the company headquarters (e.g., 'texas', 'tokyo', 'spain')",
              },
              organization_not_locations: {
                type: "array",
                items: { type: "string" },
                description:
                  "Exclude companies from search results based on location (e.g., 'minnesota', 'ireland', 'seoul')",
              },
              organization_num_employees_ranges: {
                type: "array",
                items: { type: "string" },
                description:
                  "Employee count ranges with upper and lower numbers separated by comma (e.g., '1,10', '250,500', '10000,20000')",
              },
              revenue_range: {
                type: "object",
                properties: {
                  min: {
                    type: "integer",
                    description:
                      "Minimum revenue amount (no currency symbols, commas, or decimals)",
                  },
                  max: {
                    type: "integer",
                    description:
                      "Maximum revenue amount (no currency symbols, commas, or decimals)",
                  },
                },
                description:
                  "Search for organizations based on their revenue range",
              },
              currently_using_any_of_technology_uids: {
                type: "array",
                items: { type: "string" },
                description:
                  "Technologies the organization currently uses (use underscores for spaces, e.g., 'salesforce', 'google_analytics', 'wordpress_org')",
              },
              q_organization_keyword_tags: {
                type: "array",
                items: { type: "string" },
                description:
                  "Filter search results based on keywords associated with companies (e.g., 'mining', 'sales strategy', 'consulting')",
              },
              q_organization_name: {
                type: "string",
                description:
                  "Filter search results to include a specific company name (partial matches accepted)",
              },
              organization_ids: {
                type: "array",
                items: { type: "string" },
                description:
                  "Apollo IDs for specific companies to include in search results",
              },
              latest_funding_amount_range: {
                type: "object",
                properties: {
                  min: {
                    type: "integer",
                    description:
                      "Minimum amount from most recent funding round (no currency symbols, commas, or decimals)",
                  },
                  max: {
                    type: "integer",
                    description:
                      "Maximum amount from most recent funding round (no currency symbols, commas, or decimals)",
                  },
                },
                description:
                  "Funding amount range for the company's most recent funding round",
              },
              total_funding_range: {
                type: "object",
                properties: {
                  min: {
                    type: "integer",
                    description:
                      "Minimum total funding amount across all rounds (no currency symbols, commas, or decimals)",
                  },
                  max: {
                    type: "integer",
                    description:
                      "Maximum total funding amount across all rounds (no currency symbols, commas, or decimals)",
                  },
                },
                description:
                  "Total funding amount range across all funding rounds",
              },
              latest_funding_date_range: {
                type: "object",
                properties: {
                  min: {
                    type: "string",
                    format: "date",
                    description:
                      "Earliest date of most recent funding round (YYYY-MM-DD)",
                  },
                  max: {
                    type: "string",
                    format: "date",
                    description:
                      "Latest date of most recent funding round (YYYY-MM-DD)",
                  },
                },
                description:
                  "Date range for when the company received its most recent funding round",
              },
              q_organization_job_titles: {
                type: "array",
                items: { type: "string" },
                description:
                  "Job titles listed in active job postings at the company (e.g., 'sales manager', 'research analyst')",
              },
              organization_job_locations: {
                type: "array",
                items: { type: "string" },
                description:
                  "Locations of jobs being actively recruited by the company (e.g., 'atlanta', 'japan')",
              },
              organization_num_jobs_range: {
                type: "object",
                properties: {
                  min: {
                    type: "integer",
                    description:
                      "Minimum number of active job postings at the company",
                  },
                  max: {
                    type: "integer",
                    description:
                      "Maximum number of active job postings at the company",
                  },
                },
                description:
                  "Range for number of job postings active at the company",
              },
              organization_job_posted_at_range: {
                type: "object",
                properties: {
                  min: {
                    type: "string",
                    format: "date",
                    description:
                      "Earliest date when jobs were posted by the company (YYYY-MM-DD)",
                  },
                  max: {
                    type: "string",
                    format: "date",
                    description:
                      "Latest date when jobs were posted by the company (YYYY-MM-DD)",
                  },
                },
                description:
                  "Date range for when jobs were posted by the company",
              },
              page: {
                type: "integer",
                description: "Page number for pagination (default: 1)",
              },
              per_page: {
                type: "integer",
                description:
                  "Number of results per page (max: 100, default: 25)",
              },
            },
          },
        },
        {
          name: "organization_job_postings",
          description:
            "Use the Organization Job Postings endpoint to find job postings for a specific organization",
          inputSchema: {
            type: "object",
            properties: {
              organization_id: {
                type: "string",
                description: "Apollo.io organization ID",
              },
            },
            required: ["organization_id"],
          },
        },
        {
          name: "get_person_email",
          description: "Get email address for a person using their Apollo ID",
          inputSchema: {
            type: "object",
            properties: {
              apollo_id: {
                type: "string",
                description: "Apollo.io person ID",
              },
            },
            required: ["apollo_id"],
          },
        },
        {
          name: "employees_of_company",
          description:
            "Find employees of a company using company name or website/LinkedIn URL",
          inputSchema: {
            type: "object",
            properties: {
              company: {
                type: "string",
                description: "Company name",
              },
              website_url: {
                type: "string",
                description: "Company website URL",
              },
              linkedin_url: {
                type: "string",
                description: "Company LinkedIn URL",
              },
            },
            required: ["company"],
          },
        },
      ];

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const args = request.params.arguments ?? {};

        switch (request.params.name) {
          case "people_enrichment": {
            const result = await this.apollo.peopleEnrichment(args);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "organization_enrichment": {
            const result = await this.apollo.organizationEnrichment(
              args.domain as string
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "people_search": {
            const result = await this.apollo.peopleSearch(args);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "organization_search": {
            const result = await this.apollo.organizationSearch(args);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "organization_job_postings": {
            const result = await this.apollo.organizationJobPostings(
              args.organization_id as string
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "get_person_email": {
            const result = await this.apollo.getPersonEmail(
              args.apollo_id as string
            );
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case "employees_of_company": {
            const result = await this.apollo.employeesOfCompany(args as any);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error: any) {
        console.error(`Error executing tool ${request.params.name}:`, error);
        return {
          content: [
            {
              type: "text",
              text: `Apollo.io API error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async connect(transport: any): Promise<void> {
    await this.server.connect(transport);
    console.log("Apollo.io MCP server started");
  }

  getServer(): Server {
    return this.server;
  }
}
