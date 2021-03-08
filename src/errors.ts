import { IPrismDiagnostic } from './prism';
import { FulfilledHttpRequest } from './operation-validator';

export { IPrismDiagnostic } from './prism';

export class OpenapiOperationError extends Error {
  constructor(message: string, fulfilledHttpRequest: FulfilledHttpRequest) {
    const { req } = fulfilledHttpRequest;

    const target = `${req.method.toUpperCase()} ${req.url.path}`;

    super(`${target} :: ${message}`);

    Error.captureStackTrace(this, Error);
    Object.defineProperty(this, 'name', { value: this.constructor.name });
    Object.defineProperty(this, 'fulfilledHttpRequest', {
      value: fulfilledHttpRequest,
    });
  }
}

export interface OpenapiOperationError extends Error {
  readonly fulfilledHttpRequest: FulfilledHttpRequest;
}

function extractCodeFromError(error: Error): undefined | string {
  const matches = /(?<=#).*$/.exec(error.name ?? '');
  const [code] = matches ?? [];

  return code ?? error?.name;
}

interface ProblemJsonError extends Error {
  detail?: string;
}

function extractSummaryFromError(error: Error): string {
  const problemErr = error as ProblemJsonError;
  const message = problemErr.message;

  return problemErr.detail ? `${message} :: ${problemErr.detail}` : message;
}

export class OpenapiOperationRoutingError extends OpenapiOperationError {
  public readonly code?: string;

  constructor(
    fulfilledHttpRequest: FulfilledHttpRequest,
    originalError: Error,
  ) {
    super(extractSummaryFromError(originalError), fulfilledHttpRequest);

    this.code = extractCodeFromError(originalError);
    Object.defineProperty(this, 'originalError', { value: originalError });
  }
}

export interface OpenapiOperationRoutingError extends OpenapiOperationError {
  readonly originalError: Error;
}

export class OpenapiOperationValidationError extends OpenapiOperationError {
  public readonly diagnostics: IPrismDiagnostic[];

  constructor(
    fulfilledHttpRequest: FulfilledHttpRequest,
    diagnostics: IPrismDiagnostic[],
  ) {
    super(
      `OpenAPI operation validation failed :: Diagnostics (JSON): ${JSON.stringify(
        diagnostics,
      )}`,
      fulfilledHttpRequest,
    );

    this.diagnostics = diagnostics;
  }
}

export class OpenapiRequestOperationValidationError extends OpenapiOperationValidationError {}

export class OpenapiResponseOperationValidationError extends OpenapiOperationValidationError {}

export class OpenapiSecurityOperationValidationError extends OpenapiOperationValidationError {}
