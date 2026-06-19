export {};

declare module "koa" {
  interface ContextDelegatedRequest {
    body?: unknown;
    rawBody?: string;
  }
}
