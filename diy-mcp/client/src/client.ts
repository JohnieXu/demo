import * as readline from "node:readline/promises";
import { spawn } from "node:child_process";
import { intro, isCancel, select, text } from "@clack/prompts";
import chalk from "chalk";

type Tool = {
  name: string;
  description: string;
  inputSchema: {
    properties: Record<string, any>;
  };
};

type Resource = {
  uri: string;
  name: string;
};

type Content = {
  text: string;
};

async function callAI(
  messages: { role: string; content: string }[],
  tools: any[]
) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4096,
      messages,
      tools,
    }),
  });

  const data = await response.json();
  return data.content;
}

(async function main() {
  const serverProcess = spawn("node", ["../server/dist/index.js"], {
    stdio: ["pipe", "pipe", "inherit"],
  });

  const rl = readline.createInterface({
    input: serverProcess.stdout,
    output: undefined,
  });

  let lastId = 0;
  async function send(
    method: string,
    params: object = {},
    isNotification?: boolean
  ) {
    serverProcess.stdin.write(
      JSON.stringify({
        jsonrpc: "2.0",
        method,
        params,
        id: isNotification ? undefined : lastId++,
      }) + "\n"
    );
    if (isNotification) {
      return;
    }
    const json = await rl.question("");
    return JSON.parse(json).result;
  }

  const {
    serverInfo,
    capabilities,
  }: {
    serverInfo: { name: string; version: string };
    capabilities: {
      tools?: any;
      resources?: any;
    };
  } = await send("initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "diy-client", version: "0.1.0" },
  });
  await send("notifications/initialized", {}, true);
  const tools: Tool[] = capabilities.tools
    ? (await send("tools/list", { _meta: { progressToken: 1 } })).tools
    : [];
  const resources: Resource[] = capabilities.resources
    ? (await send("resources/list", { _meta: { progressToken: 1 } })).resources
    : [];

  intro(`Connected to ${serverInfo.name} v${serverInfo.version}`);

  async function callAIWithTools(
    messages: { role: string; content: string }[]
  ) {
    const result = await callAI(
      messages,
      tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      }))
    );
    return result;
  }

  function dumpContent(content: { text: string }[]) {
    for (const line of content) {
      try {
        console.log(JSON.parse(line.text));
      } catch (e) {
        console.log(line.text);
      }
    }
  }

  while (true) {
    const options = [{ value: "ai", label: "Ask the AI" }];
    if (resources.length > 0) {
      options.unshift({ value: "resource", label: "Get a resource" });
    }
    if (tools.length > 0) {
      options.unshift({ value: "tool", label: "Run a tool" });
    }
    const action = await select({
      message: "What would you like to do?",
      options,
    });
    if (isCancel(action)) {
      process.exit(0);
    }

    if (action === "tool") {
      const tool = await select({
        message: "Select a tool.",
        options: tools.map((tool) => ({ value: tool, label: tool.name })),
      });

      if (isCancel(tool)) {
        process.exit(0);
      }

      const args: Record<string, any> = {};
      for (const key of Object.keys(tool?.inputSchema.properties ?? {}).filter(
        (key) => tool?.inputSchema?.properties?.[key]?.type === "string"
      )) {
        const answer = await text({
          message: `${key}:`,
          initialValue: "",
        });
        if (isCancel(answer)) {
          process.exit(0);
        }
        args[key] = answer;
      }

      const {
        content,
      }: {
        content: Content[];
      } = await send("tools/call", {
        name: tool.name,
        arguments: args,
      });
      dumpContent(content);
    }

    if (action === "resource") {
      const resource = await select({
        message: "Select a resource.",
        options: resources.map((resource) => ({
          value: resource,
          label: resource.name,
        })),
      });

      if (isCancel(resource)) {
        process.exit(0);
      }

      const { contents }: { contents: Content[] } = await send(
        "resources/read",
        {
          uri: resource.uri,
        }
      );

      dumpContent(contents);
    }

    if (action === "ai") {
      const prompt = await text({
        message: "What would you like to ask?",
        defaultValue: "What kinds of drinks do you have?",
      });
      if (isCancel(prompt)) {
        process.exit(0);
      }

      const messages: {
        type?: string;
        role: string;
        content: any;
        name?: string;
        input?: any;
      }[] = [{ role: "user", content: prompt }];
      const promptResult = await callAIWithTools(messages);
      messages.push({
        role: "assistant",
        content: promptResult,
      });
      for (const tool of promptResult) {
        if (tool.type === "text") {
          console.log(tool.text);
        }
      }

      if (promptResult[promptResult.length - 1].type === "tool_use") {
        console.log(
          chalk.blueBright(
            `Requesting tool call ${
              promptResult[promptResult.length - 1].name
            } - ${JSON.stringify(promptResult[promptResult.length - 1].input)}`
          )
        );

        const { content }: { content: Content[] } = await send("tools/call", {
          name: promptResult[promptResult.length - 1].name,
          arguments: promptResult[promptResult.length - 1].input,
        });

        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: promptResult[promptResult.length - 1].id,
              content: content[0].text,
            },
          ],
        });

        const followupResult = await callAIWithTools(messages);
        for (const tool of followupResult) {
          if (tool.type === "text") {
            console.log(tool.text);
          }
        }
      }
    }
  }
})();
