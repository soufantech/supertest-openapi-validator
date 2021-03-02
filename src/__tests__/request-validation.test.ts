import loadContract from './helpers/load-contract';
import request from './helpers/request';
import { OpenapiOperationValidationError } from '..';

test('Non-compliant request fails validation.', async () => {
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
