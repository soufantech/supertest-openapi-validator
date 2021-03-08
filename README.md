<div align="center">
  <img src="https://avatars2.githubusercontent.com/u/61063724?s=200&v=4" width="100px">
</div>

<br />

<div align="center">
  <h1>@soufantech/supertest-openapi-validator</h1>
  <p>Performs OpenAPI contract checks with supertest</p>
</div>

<br />

<div align="center">

[![typescript-image]][typescript-url] [![jest-image]][jest-url] [![npm-image]][npm-url]

</div>

## Install

```console
yarn add @soufantech/supertest-openapi-validator
```

❗ This package is currently private. You'll need to set a valid npm token to `SOUFAN_NPM_TOKEN` environment variable in order to install it.

## Usage

### Specification file loading

Load the specification file (`openapi.yaml` in the example below) **asynchronously**.

```js
/// file: get-contract.js

import path from 'path';
import {
  loadOpenapiContract,
} from '@soufantech/supertest-openapi-validator';

// contract is a promise
const contract = loadOpenapiContract(
  path.resolve(__dirname, 'openapi.yaml'),
);

export default (): => contract;
```

It is also possible to create multiple contract objects when there is multiple specification files.

Attention: `loadOpenapiContract` will throw an `Error` exception if the specification file cannot be read or is malformed.

Attention: `loadOpenapiContract` returns a promise that resolves to the contract object.

Loading the contract test files can be done like this:

```js
/// file: foo.test.js

import getContract from './get-contract';

test('Loads a contract.', async () => {
  // It's necessary to await, because
  // getContract returns a promise.
  const contract = await getContract();
});
```

### Validation

Create a validator using the `createValidator` contract method and call `getChecker` on the returned validator object to get a validator callback for use in supertest's `expect`:

```js
/// file: app.test.js

import getContract from './get-contract';
import supertest from './supertest';
import app from './app'; // express app

const request = supertest(app);

test('Compliant request and response pass validation.', async () => {
  const contract = await getContract();
  const validator = contract.createValidator();

  await request.get('/health').expect(validator.getChecker());
});
```

Optionally, use the `validate` method to validate the object returned by supertest directly (this approach is useful for inspecting and debugging). The `validate` method returns a [`Result`](https://github.com/soufantech/result) object, so `get`, `getOrThrow` and many other `Result` methods can be used to unwrap the supertest response object or the openapi validation error. 

Testing using `validate` with `get` and `getOrThrow`:

```js
/// file: app.test.js

import { OpenapiOperationError } from '@soufantech/supertest-openapi-validator';
import getContract from './get-contract';
import supertest from './supertest';
import app from './app'; // express app

const request = supertest(app);

test('Using `validate` with `getOrThrow`.', async () => {
  const contract = await getContract();
  const validator = contract.createValidator();

  const response = await request.get('/health');

  // returns the response object untouched or throws an exception if
  // validation fails.
  const validatedResponse = validator.validate(response).getOrThrow();
});

test('Using `validate` with `get`.', async () => {
  const contract = await getContract();
  const validator = contract.createValidator();

  const response = await request.get('/health');

  // returns either the response or the validation error.
  const responseOrError = validator.validate(response).get();

  // OpenapiOperationError is the base error for all validation fails.
  expect(responseOrError).not.toBeInstanceOf(OpenapiOperationError);
});
```

#### Bypassing specific validations

It's possible to bypass `response`, `request` and/or `security` validation. To do so, turn off (setting the corresponding property to `false`) one or more validation in the options object passed to the `createValidator` method:

```js
// bypasses request validation
const validator1 = contract.createValidator({ request: false });

// bypasses response validation
const validator2 = contract.createValidator({ response: false });

// bypasses security and request validation
const validator3 = contract.createValidator({ security: false });

// bypasses security and request validation
const validator4 = contract.createValidator(
  { 
    security: false,
    request: false,
  }
);

// bypasses all validation (may be useful for debugging)
const validator5 = contract.createValidator(
  { 
    security: false,
    request: false,
    response: false,
  }
);

// bypasses no validation
const validator6 = contract.createValidator();

// bypasses no validation (redundant, but valid)
const validator7 = contract.createValidator(
  { 
    security: true,
    request: true,
    response: true,
  }
);
```

### Error hierarchy

In order to identify the source of the error (if it happened during routing, request, response etc.) and to treat them conditionally, there is the following error hierarchy:

```
Error
└─ OpenapiOperationError
   ├─ OpenapiOperationRoutingError
   └─ OpenapiOperationValidationError
      ├─ OpenapiRequestOperationValidationError 
      ├─ OpenapiResponseOperationValidationError
      └─ OpenapiSecurityOperationValidationError
```

#### OpenapiOperationError

The base class for all operation (routing or validation) errors.

Extends: `Error`  
Properties:

* `fulfilledHttpRequest` {{ `object` }} :: a non-enumerable object containing the  properties `req` {{ `IHttpRequest` }} and `res` {{ `IHttpResponse` }}.

#### OpenapiOperationRoutingError

A routing error - occurs when the request or response does not match any endpoints described in the specification file.

Extends: `OpenapiOperationError`  
Properties:

* `originalError` {{ `Error` }}: the original error thrown inside from prism's router.

#### OpenapiOperationValidationError

The base class for all validation errors.

Extends: `OpenapiOperationError`  
Properties:

* `diagnostics` {{ `IPrismDiagnostic[]` }} :: an array of prism diagnostic objects.

#### OpenapiRequestOperationValidationError

A validation error that originated from a **request** validation operation.

Extends: `OpenapiOperationValidationError` 

#### OpenapiResponseOperationValidationError

A validation error that originated from a **response** validation operation.

Extends: `OpenapiOperationValidationError` 

#### OpenapiResponseOperationValidationError

A validation error that originated from a **security** validation operation.

Extends: `OpenapiSecurityValidationError`

---

<div align="center">
  <sub>Built with ❤︎ by <a href="https://soufan.com.br">SouFan</a>
</div>

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"

[npm-image]: https://img.shields.io/npm/v/@soufantech/supertest-openapi-validator.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@soufantech/supertest-openapi-validator "npm"

[jest-image]: https://img.shields.io/badge/tested_with-jest-99424f.svg?style=for-the-badge&logo=jest
[jest-url]: https://github.com/facebook/jest "jest"
