export class ApiError extends Error {
  statusCode?: number;
  path?: string;
  type?: string;
  timestamp?: string;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      path?: string;
      type?: string;
      timestamp?: string;
    }
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = options?.statusCode;
    this.path = options?.path;
    this.type = options?.type;
    this.timestamp = options?.timestamp;
  }
}
