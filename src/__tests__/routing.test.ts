import loadContract from './helpers/load-contract';
import request from './helpers/request';
import { OpenapiOperationRoutingError } from '..';

test('Routing succeeds when requested path is fully specified.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  await request.get('/square/100').expect(validator.getChecker());
});

test('Routing fails when requested path is not specified.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/secret');

  const validationError = validator
    .validate(res)
    .get() as OpenapiOperationRoutingError;

  expect(validationError).toBeInstanceOf(OpenapiOperationRoutingError);
  expect(validationError.code).toBe('NO_PATH_MATCHED_ERROR');
});

test('Routing fails when request method does not match the specified path.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.put('/message');

  const validationError = validator
    .validate(res)
    .get() as OpenapiOperationRoutingError;

  expect(validationError).toBeInstanceOf(OpenapiOperationRoutingError);
  expect(validationError.code).toBe('NO_METHOD_MATCHED_ERROR');
});
