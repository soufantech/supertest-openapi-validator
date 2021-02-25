import { IHttpRequest, IHttpResponse, HttpMethod } from './prism';

import supertest from 'supertest';
import { URL } from 'url';

export const translateRequest = (req: supertest.Request): IHttpRequest => {
  return {
    ...req,
    method: req.method.toLowerCase() as HttpMethod,
    url: {
      path: new URL(req.url).pathname,
    },
  };
};

export const translateResponse = (res: supertest.Response): IHttpResponse => {
  return { ...res, statusCode: res.status };
};
