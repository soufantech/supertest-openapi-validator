import {
  IHttpRequest,
  IHttpResponse,
  IHttpOperation,
  IPrismDiagnostic,
} from './prism';
import { Result } from '@soufantech/result';

export type FulfilledHttpRequest = {
  req: IHttpRequest;
  res: IHttpResponse;
};

export interface OperationValidator {
  (operation: IHttpOperation, fulfilledRequest: FulfilledHttpRequest): Result<
    FulfilledHttpRequest,
    Error | IPrismDiagnostic[]
  >;
}

export interface OperationRouter {
  (
    operations: IHttpOperation[],
    fulfilledRequest: FulfilledHttpRequest,
  ): Result<IHttpOperation, Error>;
}
