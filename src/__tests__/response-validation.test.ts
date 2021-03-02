import loadContract from './helpers/load-contract';
import request from './helpers/request';
import { OpenapiOperationValidationError } from '..';

test('Non-compliant response fails validation.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/status/318');

  const validationError = validator
    .validate(res)
    .get() as OpenapiOperationValidationError;

  expect(validationError).toBeInstanceOf(OpenapiOperationValidationError);
  expect(validationError.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringContaining('status code'),
      }),
    ]),
  );
});

test('Non-compliant response still fails validation when request validation is turned off.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator({ request: false });

  const res = await request.get('/square/abc');

  const validationError = validator
    .validate(res)
    .get() as OpenapiOperationValidationError;

  expect(res.body.number).toBeNull();
  expect(validationError).toBeInstanceOf(OpenapiOperationValidationError);
  expect(validationError.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        path: expect.arrayContaining(['body', 'number']),
        code: 'type',
      }),
    ]),
  );
});

test('Non-compliant response fails validation.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/status/318');

  const validationError = validator
    .validate(res)
    .get() as OpenapiOperationValidationError;

  expect(validationError).toBeInstanceOf(OpenapiOperationValidationError);
  expect(validationError.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringContaining('status code'),
      }),
    ]),
  );
});

test('Non-compliant response passes validation when response validation is turned off.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator({ response: false });

  await request.get('/status/318').expect(validator.getChecker());
});
