import {
  validateInput,
  validateOutput,
  validateSecurity as validateSecurityOperation,
  IHttpOperation,
  route,
  IHttpRequest,
  IHttpResponse,
  IPrismDiagnostic,
} from './prism';
import { fold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { success, failure, Result } from '@soufantech/result';
import {
  OpenapiOperationRoutingError,
  OpenapiRequestOperationValidationError,
  OpenapiSecurityOperationValidationError,
  OpenapiResponseOperationValidationError,
  OpenapiOperationError,
} from './errors';
export { IHttpOperation } from './prism';

export type FulfilledHttpRequest = {
  req: IHttpRequest;
  res: IHttpResponse;
};

export interface OperationValidator {
  (operation: IHttpOperation, fulfilledRequest: FulfilledHttpRequest): Result<
    FulfilledHttpRequest,
    OpenapiOperationError
  >;
}

export interface OperationRouter {
  (
    operations: IHttpOperation[],
    fulfilledRequest: FulfilledHttpRequest,
  ): Result<IHttpOperation, OpenapiOperationRoutingError>;
}

export const routeOperation: OperationRouter = (
  operations: IHttpOperation[],
  fulfilledReq: FulfilledHttpRequest,
) => {
  return pipe(
    route({
      resources: operations,
      input: fulfilledReq.req,
    }),
    fold<
      Error,
      IHttpOperation,
      Result<IHttpOperation, OpenapiOperationRoutingError>
    >(
      (err) => failure(new OpenapiOperationRoutingError(fulfilledReq, err)),
      success,
    ),
  );
};

export const validateRequest: OperationValidator = (
  operation: IHttpOperation,
  fulfilledReq: FulfilledHttpRequest,
) => {
  return pipe(
    validateInput({
      resource: operation,
      element: fulfilledReq.req,
    }),
    fold<
      IPrismDiagnostic[],
      IHttpRequest,
      Result<FulfilledHttpRequest, OpenapiRequestOperationValidationError>
    >(
      (diagnostics) =>
        failure(
          new OpenapiRequestOperationValidationError(fulfilledReq, diagnostics),
        ),
      () => success(fulfilledReq),
    ),
  );
};

export const validateSecurity: OperationValidator = (
  operation: IHttpOperation,
  fulfilledReq: FulfilledHttpRequest,
) => {
  return pipe(
    validateSecurityOperation({
      resource: operation,
      element: fulfilledReq.req,
    }),
    fold<
      IPrismDiagnostic[],
      Pick<IHttpRequest, 'url' | 'headers'>,
      Result<FulfilledHttpRequest, OpenapiSecurityOperationValidationError>
    >(
      (diagnostics) =>
        failure(
          new OpenapiSecurityOperationValidationError(
            fulfilledReq,
            diagnostics,
          ),
        ),
      () => success(fulfilledReq),
    ),
  );
};

export const validateResponse: OperationValidator = (
  operation: IHttpOperation,
  fulfilledReq: FulfilledHttpRequest,
) => {
  return pipe(
    validateOutput({
      resource: operation,
      element: fulfilledReq.res,
    }),
    fold<
      IPrismDiagnostic[],
      IHttpResponse,
      Result<FulfilledHttpRequest, OpenapiResponseOperationValidationError>
    >(
      (diagnostics) =>
        failure(
          new OpenapiResponseOperationValidationError(
            fulfilledReq,
            diagnostics,
          ),
        ),
      () => success(fulfilledReq),
    ),
  );
};
