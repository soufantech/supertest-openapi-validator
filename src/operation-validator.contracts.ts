import { IHttpRequest, IHttpResponse, IHttpOperation } from './prism';
import { Result } from '@soufantech/result';
import { OpenapiOperationError, OpenapiOperationRoutingError } from './errors';

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
