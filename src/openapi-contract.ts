import { ContractValidator, ValidateOptions } from './contract-validator';
import { getHttpOperationsFromSpec, IHttpOperation } from './prism';

export class OpenapiContract {
  constructor(private readonly operations: IHttpOperation[]) {}

  createValidator(validateOptions: ValidateOptions): ContractValidator {
    return new ContractValidator(this.operations, validateOptions);
  }
}

export async function loadOpenapiContract(
  openapiContractPath: string,
): Promise<OpenapiContract> {
  return new OpenapiContract(
    await getHttpOperationsFromSpec(openapiContractPath),
  );
}
