import loadContract from './helpers/load-contract';
import request from './helpers/request';

test('Passing validation returns an untouched reference of the HTTP response object under validation.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/square/100').expect(validator.getChecker());
  const validatedRes = validator.validate(res).getOrThrow();

  expect(validatedRes).toStrictEqual(res);
});

test('Compliant request and response pass validation.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  await request.get('/square/100').expect(validator.getChecker());
});
