import loadContract from './helpers/load-contract';
import request from './helpers/request';
import {
  OpenapiOperationRoutingError,
  OpenapiOperationValidationError,
} from '..';

test('Validation pass returning an untouched reference of the response object under validation.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/square/100').expect(validator.getChecker());

  const validatedRes = validator.validate(res).getOrThrow();

  expect(validatedRes).toStrictEqual(res);
});

test('Validation pass with a contract-matching request and response.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  await request.get('/square/100').expect(validator.getChecker());
});

test('Routing fails with an unspecified path.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/secret');

  const validationError = validator
    .validate(res)
    .get() as OpenapiOperationRoutingError;

  expect(validationError).toBeInstanceOf(OpenapiOperationRoutingError);
  expect(validationError.code).toBe('NO_PATH_MATCHED_ERROR');
});

test('Routing fails if method does not match.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.put('/message');

  const validationError = validator
    .validate(res)
    .get() as OpenapiOperationRoutingError;

  expect(validationError).toBeInstanceOf(OpenapiOperationRoutingError);
  expect(validationError.code).toBe('NO_METHOD_MATCHED_ERROR');
});

test('Validation fails with bad input.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/square/abc');

  const validationError = validator
    .validate(res)
    .get() as OpenapiOperationValidationError;

  expect(validationError).toBeInstanceOf(OpenapiOperationValidationError);
  expect(validationError.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        path: expect.arrayContaining(['path', 'number']),
        code: 'type',
      }),
    ]),
  );
});

test('Validation fails with a bad request path argument.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/square/abc');

  const validationError = validator
    .validate(res)
    .get() as OpenapiOperationValidationError;

  expect(validationError).toBeInstanceOf(OpenapiOperationValidationError);
  expect(validationError.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        path: expect.arrayContaining(['path', 'number']),
        code: 'type',
      }),
    ]),
  );
});
