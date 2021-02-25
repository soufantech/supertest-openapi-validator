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
  FulfilledHttpRequest,
  OperationRouter,
  OperationValidator,
} from './validator.contracts';

export const routeOperation: OperationRouter = (
  operations: IHttpOperation[],
  fulfilledReq: FulfilledHttpRequest,
) => {
  return pipe(
    route({
      resources: operations,
      input: fulfilledReq.req,
    }),
    fold<Error, IHttpOperation, Result<IHttpOperation, Error>>(
      failure,
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
      Result<FulfilledHttpRequest, IPrismDiagnostic[]>
    >(failure, () => success(fulfilledReq)),
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
      Result<FulfilledHttpRequest, IPrismDiagnostic[]>
    >(failure, () => success(fulfilledReq)),
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
      Result<FulfilledHttpRequest, IPrismDiagnostic[]>
    >(failure, () => success(fulfilledReq)),
  );
};
