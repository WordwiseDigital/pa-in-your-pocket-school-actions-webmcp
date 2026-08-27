interface WebMCPToolAnnotations {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
}

interface WebMCPTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: WebMCPToolAnnotations;
  execute: (
    input: Record<string, unknown>,
    options: { signal: AbortSignal },
  ) => Promise<unknown> | unknown;
}

interface WebMCPModelContext {
  registerTool: (
    tool: WebMCPTool,
    options?: { signal?: AbortSignal; exposedTo?: string[] },
  ) => Promise<void>;
}

interface Document {
  modelContext?: WebMCPModelContext;
}

