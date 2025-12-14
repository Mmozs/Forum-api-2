// tests/integration/http/api/threads.test.js
const createServer = require('../createServer');
const container = require('../../container');

describe('Threads API', () => {
  let server;
  let accessToken;

  beforeAll(async () => {
    server = await createServer(container);

  // 1. Daftar user test
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'userTest',
        password: 'password',
        fullname: 'User Test',
      },
    });

  // 2. Login untuk dapat token
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'userTest',
        password: 'password',
      },
    });

    const loginJson = JSON.parse(loginResponse.payload);
    accessToken = loginJson.data.accessToken;
  });


  afterAll(async () => {
    await server.stop();
  });

  describe('POST /threads', () => {
    it('should respond 201 and return added thread', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul Thread',
          body: 'Body Thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`, // generate token valid di test
        },
      });

      const resJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(201);
      expect(resJson.status).toBe('success');
      expect(resJson.data.addedThread).toHaveProperty('id');
      expect(resJson.data.addedThread.title).toBe('Judul Thread');
    });

    it('should respond 400 when payload is missing required property', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          body: 'Hanya body, tanpa title',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const resJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(resJson.status).toBe('fail');
      expect(resJson.message).toBeDefined();
    });

    it('should respond 401 when no token is provided', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Judul',
          body: 'Body',
        },
      });

      const resJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(401);
      expect(resJson.status).toBe('fail');
      expect(resJson.message).toBeDefined();
    });
  });

  describe('GET /threads/{threadId}', () => {
    it('should respond 200 and return thread detail', async () => {
      // buat thread dulu
      const postResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'Judul', body: 'Body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const threadId = JSON.parse(postResponse.payload).data.addedThread.id;

      // ambil detail
      const getResponse = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
        // bisa tanpa token jika GET thread adalah publik
      });

      const getJson = JSON.parse(getResponse.payload);
      expect(getResponse.statusCode).toBe(200);
      expect(getJson.status).toBe('success');
      expect(getJson.data.thread).toHaveProperty('id', threadId);
      expect(getJson.data.thread.comments).toBeInstanceOf(Array);
    });

    it('should respond 404 for thread not found', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-unknown',
      });
      const resJson = JSON.parse(response.payload);

      expect(response.statusCode).toBe(404);
      expect(resJson.status).toBe('fail');
      expect(resJson.message).toBeDefined();
    });
  });
});
