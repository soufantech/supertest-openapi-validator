import supertest from 'supertest';
import { translateRequest, translateResponse } from './translators';
import { Result, success, failure } from '@soufantech/result';
import {
  FulfilledHttpRequest,
  OperationValidator,
} from './operation-validator.contracts';
import {
  IHttpOperation,
  routeOperation,
  validateSecurity,
  validateRequest,
  validateResponse,
} from './operation-validator';
import { OpenapiOperationError } from './errors';

export interface SupertestChecker {
  (res: supertest.Response): supertest.Response;
}

export type ValidateSettings = {
  response: boolean;
  request: boolean;
  security: boolean;
};

export type ValidateOptions = Partial<ValidateSettings>;

interface ResponseWithEmbeddedRequest extends supertest.Response {
  request: supertest.Request;
}

const defaultValidateSettings: ValidateSettings = {
  request: true,
  response: true,
  security: true,
};

const validators: Record<keyof ValidateSettings, OperationValidator> = {
  request: validateRequest,
  response: validateResponse,
  security: validateSecurity,
};

function filterValidator(selection: ValidateOptions): OperationValidator[] {
  return Object.entries(selection)
    .filter(([key, val]) => {
      return (
        val === true &&
        typeof validators[key as keyof ValidateSettings] === 'function'
      );
    })
    .map(([key]) => validators[key as keyof ValidateSettings]);
}

function translateSupertestResponse(
  response: supertest.Response,
): FulfilledHttpRequest {
  const supertestResponse = response as ResponseWithEmbeddedRequest;

  return {
    res: translateResponse(supertestResponse),
    req: translateRequest(supertestResponse.request),
  };
}

export class ContractValidator {
  private readonly validators: OperationValidator[];

  constructor(
    private readonly operations: IHttpOperation[],
    readonly validateOptions: ValidateOptions = {},
  ) {
    this.validators = filterValidator({
      ...defaultValidateSettings,
      ...validateOptions,
    });
  }

  getChecker(): SupertestChecker {
    return (res: supertest.Response) => this.validate(res).getOrThrow();
  }

  validate(
    response: supertest.Response,
  ): Result<supertest.Response, OpenapiOperationError> {
    const fulfilledReq = translateSupertestResponse(response);

    return routeOperation(this.operations, fulfilledReq)
      .fold((operation) => {
        return this.validators.reduce<
          Result<FulfilledHttpRequest, OpenapiOperationError>
        >((res, validator) => {
          return res.flatMapSuccess((s) => validator(operation, s));
        }, success(fulfilledReq));
      }, failure)
      .mapSuccess(() => response);
  }
}
