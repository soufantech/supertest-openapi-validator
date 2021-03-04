import supertest from 'supertest';

export interface ResponseWithEmbeddedRequest extends supertest.Response {
  // Yeah, _data is private. We are not proud of it. But keep in mind
  // this whole project is a huge (and hopelly worthy) hack.
  request: supertest.Request & { _data: unknown };
}
