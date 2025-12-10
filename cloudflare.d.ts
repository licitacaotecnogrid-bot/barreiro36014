interface ExportedHandler {
  fetch?: (request: Request, env: any, context: any) => Promise<Response>;
}

declare namespace globalThis {
  var ExportedHandler: ExportedHandler;
}

export { ExportedHandler };
