import loadContract from './helpers/load-contract';
import request from './helpers/request';
import { OpenapiOperationRoutingError } from '..';

test('validate returns an untouched reference of the response object under validation.', async () => {
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

test('Validation fails with an unspecified path.', async () => {
  const contract = await loadContract();
  const validator = contract.createValidator();

  const res = await request.get('/secret');

  expect(() => {
    validator.validate(res).getOrThrow();
  }).toThrowError(OpenapiOperationRoutingError);
});

// test('Validation fails with a bad request path.', async () => {
//   const contract = await loadContract();
//   const validator = contract.createValidator();

//   const res = await request.get('/users');

//   // expect(() => {
//   //   validator.validate(res).getOrThrow();
//   // }).toThrowError('Route not resolved, no path matched');

//   console.log(validator.validate(res).getOrThrow().body);

//   // console.log(error);
//   // console.log(inspect(error, true, null));
// });
