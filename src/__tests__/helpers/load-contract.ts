import { loadOpenapiContract, OpenapiContract } from '../..';
import path from 'path';

const contract = loadOpenapiContract(
  path.resolve(__dirname, '..', 'fixtures', 'openapi.yaml'),
);

export default (): Promise<OpenapiContract> => contract;
