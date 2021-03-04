import { IHttpRequest, IHttpResponse, HttpMethod } from './prism';
import { ResponseWithEmbeddedRequest } from './response-with-embedded-request';

import supertest from 'supertest';
import { URL } from 'url';

export const translateRequest = (req: supertest.Request): IHttpRequest => {
  return {
    ...req,
    method: req.method.toLowerCase() as HttpMethod,
    url: {
      path: new URL(req.url).pathname,
    },
    body: (req as ResponseWithEmbeddedRequest['request'])._data,
  };
};

export const translateResponse = (res: supertest.Response): IHttpResponse => {
  return {
    ...res,
    statusCode: res.status,
  };
};
