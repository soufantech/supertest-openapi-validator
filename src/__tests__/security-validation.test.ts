import loadContract from './helpers/load-contract';
import request from './helpers/request';
import { OpenapiSecurityOperationValidationError } from '..';

test('Missing Authorization header fails validation.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/users/johndoe');

  const validationError = validator
    .validate(res)
    .get() as OpenapiSecurityOperationValidationError;

  expect(validationError).toBeInstanceOf(
    OpenapiSecurityOperationValidationError,
  );
  expect(validationError.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringContaining('Invalid security scheme'),
        tags: expect.arrayContaining(['Bearer']),
        code: 401,
      }),
    ]),
  );
});

test('Non-compliant request Authorization header fails validation.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request
    .get('/users/johndoe')
    .set('Authorization', 'Basic am9obnN0YW1vczoxNDIzZzIzZzIzZwo=');

  const validationError = validator
    .validate(res)
    .get() as OpenapiSecurityOperationValidationError;

  expect(validationError).toBeInstanceOf(
    OpenapiSecurityOperationValidationError,
  );
  expect(validationError.diagnostics).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        message: expect.stringContaining('Invalid security scheme'),
        tags: expect.arrayContaining(['Bearer']),
        code: 401,
      }),
    ]),
  );
});

test('Non-compliant request Authorization header passes validation when security validation is ignored.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator({ security: false });

  await request.get('/users/johndoe').expect(validator.getChecker());
});
