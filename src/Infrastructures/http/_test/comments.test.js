// tests/integration/http/api/comments.test.js
const createServer = require('../createServer');
const container = require('../../container');

describe('Comments API', () => {
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

  describe('POST /threads/{threadId}/comments', () => {
    it('should response 201 when adding a comment to a thread', async () => {
      // buat thread dulu
      const postThreadRes = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'Judul', body: 'Body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const threadId = JSON.parse(postThreadRes.payload).data.addedThread.id;

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'Komentar test' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const resJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(201);
      expect(resJson.status).toBe('success');
      expect(resJson.data.addedComment).toHaveProperty('id');
      expect(resJson.data.addedComment.content).toBe('Komentar test');
    });

    it('should response 400 when payload invalid', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {},  // invalid
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const resJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(resJson.status).toBe('fail');
      expect(resJson.message).toBeDefined();
    });

    it('should response 404 when threadId is invalid', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-unknown/comments',
        payload: { content: 'Hi' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const resJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(404);
      expect(resJson.status).toBe('fail');
      expect(resJson.message).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond 200 when comment deleted by owner', async () => {
      // buat thread, komen, lalu hapus comment
      const postThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'Judul', body: 'Body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const threadId = JSON.parse(postThread.payload).data.addedThread.id;

      const postComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'Komentar' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const commentId = JSON.parse(postComment.payload).data.addedComment.id;

      const delRes = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const delJson = JSON.parse(delRes.payload);

      expect(delRes.statusCode).toBe(200);
      expect(delJson.status).toBe('success');
    });

    it('should respond 404 when comment does not exist', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/comment-xyz`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = JSON.parse(res.payload);

      expect(res.statusCode).toBe(404);
      expect(json.status).toBe('fail');
      expect(json.message).toBeDefined();
    });

    // test 403 bisa ditambahkan jika skenario owner vs non-owner
  });
});
