import loadContract from './helpers/load-contract';
import request from './helpers/request';

test('validate returns an untouched reference of the response object under validation.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/square/100').expect(validator.getChecker());

  const validatedRes = validator.validate(res).getOrThrow();

  expect(validatedRes).toStrictEqual(res);
});

test('validation pass with a contract-matching request and response.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  await request.get('/square/100').expect(validator.getChecker());
});

test('validation fails with an unspecified path.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/secret');

  expect(() => {
    validator.validate(res).getOrThrow();
  }).toThrowError('Route not resolved, no path matched');
});
