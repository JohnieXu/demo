import * as readline from "node:readline";
import { stdin, stdout } from "node:process";

const serverInfo = {
  name: "Coffee Shop Server",
  version: "1.0.0",
};

const drinks = [
  {
    name: "Latte",
    price: 5,
    description:
      "A latte is a coffee drink made with espresso and steamed milk.",
  },
  {
    name: "Mocha",
    price: 6,
    description: "A mocha is a coffee drink made with espresso and chocolate.",
  },
  {
    name: "Flat White",
    price: 7,
    description:
      "A flat white is a coffee drink made with espresso and steamed milk.",
  },
];

const resources = [
  {
    uri: "menu://app",
    name: "menu",
    get: async () => {
      return {
        contents: [
          {
            uri: "menu://app",
            text: JSON.stringify(drinks),
          },
        ],
      };
    },
  },
];

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

function sendResponse(id: number, result: object) {
  const response = {
    result,
    jsonrpc: "2.0",
    id,
  };
  console.log(JSON.stringify(response));
}

const tools = [
  {
    name: "getDrinkNames",
    description: "Get the names of the drinks in the shop",
    inputSchema: { type: "object", properties: {} },
    execute: async (args: any) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ names: drinks.map((drink) => drink.name) }),
          },
        ],
      };
    },
  },
  {
    name: "getDrinkInfo",
    description: "Get more info about the drink",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
      required: ["name"],
    },
    execute: async (args: any) => {
      const drink = drinks.find((drink) => drink.name === args.name);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(drink || { error: "Drink not found" }),
          },
        ],
      };
    },
  },
];

(async function main() {
  for await (const line of rl) {
    try {
      const json = JSON.parse(line);
      if (json.jsonrpc === "2.0") {
        if (json.method === "initialize") {
          sendResponse(json.id, {
            protocolVersion: "2025-03-26",
            capabilities: {
              tools: { listChanged: true },
              resources: { listChanged: true },
            },
            serverInfo,
          });
        }
      }
      if (json.method === "tools/list") {
        sendResponse(json.id, {
          tools: tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
          })),
        });
      }
      if (json.method === "tools/call") {
        const tool = tools.find((tool) => tool.name === json.params.name);
        if (tool) {
          const toolResponse = await tool.execute(json.params.arguments);
          sendResponse(json.id, toolResponse);
        } else {
          sendResponse(json.id, {
            error: {
              code: -32602,
              message: `MCP error -32602: Tool ${json.params.name} not found`,
            },
          });
        }
      }
      if (json.method === "resources/list") {
        sendResponse(json.id, {
          resources: resources.map((resource) => ({
            uri: resource.uri,
            name: resource.name,
          })),
        });
      }
      if (json.method === "resources/read") {
        const uri = json.params.uri;
        const resource = resources.find((resource) => resource.uri === uri);
        if (resource) {
          sendResponse(json.id, await resource.get());
        } else {
          sendResponse(json.id, {
            error: { code: -32602, message: "Resource not found" },
          });
        }
      }
      if (json.method === "ping") {
        sendResponse(json.id, {});
      }
    } catch (error) {
      console.error(error);
    }
  }
})();
