import request from './helpers/request';
import { USER_JOHN_DOE } from './fixtures/data';

//
// These are sanity checks just to assure that the server is
// behaving as expected.
//

describe('Endpoint GET /square/{number}', () => {
  test('returns an application/json 200 response with the path number squared.', async () => {
    await request
      .get('/square/100')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect({
        number: 10000,
      });
  });
});

describe('Endpoint GET /status/{statusCode}', () => {
  test.each([200, 301, 403, 502])(
    'returns an application/json response with the status number passed as argument in the URI path.',
    async (status) => {
      await request
        .get(`/status/${status}`)
        .expect('Content-Type', /application\/json/)
        .expect(status)
        .expect({
          status,
        });
    },
  );
});

describe('Endpoint GET /message', () => {
  test('returns an empty text/plain response with no message query is given as argument.', async () => {
    await request
      .get(`/message`)
      .expect('Content-Type', /text\/plain/)
      .expect(200)
      .expect('');
  });

  test('returns a text/plain response with the querystring message as the body.', async () => {
    const MESSAGE = 'Message sent!';

    await request
      .get(`/message`)
      .query({ text: MESSAGE })
      .expect('Content-Type', /text\/plain/)
      .expect(200)
      .expect(MESSAGE);
  });
});

describe('Endpoint GET /secret', () => {
  test('returns an application/json 200 response.', async () => {
    await request
      .get(`/secret`)
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect({ secret: 'Secret endpoint exposed!' });
  });
});

describe('Endpoint POST /users', () => {
  test('returns an application/json 201 response with a user resource in the body.', async () => {
    const BODY = {
      email: 'jane@example.com',
      username: 'jane',
    };

    const res = await request
      .post(`/users`)
      .send(BODY)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    expect(res.body).toEqual({
      user: BODY,
      createdAt: expect.any(String),
    });
  });
});

describe('Endpoint GET /users/johndoe', () => {
  test('returns an application/json 200 response if Authorization header is set correctly.', async () => {
    await request
      .get('/users/johndoe')
      .set('Authorization', 'Bearer abc123')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect(USER_JOHN_DOE);
  });

  test('returns an application/json 401 response if Authorization header is not present.', async () => {
    await request
      .get('/users/johndoe')
      .expect('Content-Type', /application\/json/)
      .expect('WWW-Authenticate', 'Bearer')
      .expect(401);
  });

  test('returns an application/json 403 response if Authorization header is set to an unknown value.', async () => {
    await request
      .get('/users/johndoe')
      .set('Authorization', 'Bearer xxxxxxxxxxxxxx')
      .expect('Content-Type', /application\/json/)
      .expect(403);
  });
});

test('returns an application/json 404 response when route is unknown.', async () => {
  await request
    .post(`/whatever`)
    .expect('Content-Type', /application\/json/)
    .expect(404)
    .expect({
      error: 'NOT_FOUND',
    });
});
