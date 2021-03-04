import loadContract from './helpers/load-contract';
import request from './helpers/request';
import { OpenapiRequestOperationValidationError } from '..';

test('Non-compliant request fails validation (path).', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/square/abc');

  const validationError = validator
    .validate(res)
    .get() as OpenapiRequestOperationValidationError;

  expect(validationError).toBeInstanceOf(
    OpenapiRequestOperationValidationError,
  );
  expect(validationError.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        path: expect.arrayContaining(['path', 'number']),
        code: 'type',
      }),
    ]),
  );
});

test('Non-compliant request fails validation (body).', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.post('/users').send({
    username: 'abraham',
  });

  const validationError = validator
    .validate(res)
    .get() as OpenapiRequestOperationValidationError;

  expect(validationError).toBeInstanceOf(
    OpenapiRequestOperationValidationError,
  );

  expect(validationError.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringContaining("'email'"),
        path: expect.arrayContaining(['body']),
        code: 'required',
      }),
    ]),
  );
});
