// tests/integration/http/api/replies.test.js
const createServer = require('../createServer');
const container = require('../../container');

describe('Replies API', () => {
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

  describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 when add reply', async () => {
      // buat thread
      const postThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'Judul', body: 'Body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const threadId = JSON.parse(postThread.payload).data.addedThread.id;

      // buat comment
      const postComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'Komentar' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const commentId = JSON.parse(postComment.payload).data.addedComment.id;

      // kirim balasan
      const res = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'Balasan' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = JSON.parse(res.payload);

      expect(res.statusCode).toBe(201);
      expect(json.status).toBe('success');
      expect(json.data.addedReply).toHaveProperty('id');
      expect(json.data.addedReply.content).toBe('Balasan');
    });

    it('should response 400 when payload invalid', async () => {
      const res = await server.inject({
        method: 'POST',
        url: `/threads/thread-123/comments/comment-123/replies`,
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = JSON.parse(res.payload);

      expect(res.statusCode).toBe(400);
      expect(json.status).toBe('fail');
      expect(json.message).toBeDefined();
    });

    it('should response 404 if thread or comment not found', async () => {
      const res = await server.inject({
        method: 'POST',
        url: `/threads/thread-unknown/comments/comment-unknown/replies`,
        payload: { content: 'Isi' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = JSON.parse(res.payload);

      expect(res.statusCode).toBe(404);
      expect(json.status).toBe('fail');
      expect(json.message).toBeDefined();
    });
  });

  describe('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when reply deleted by owner', async () => {
      // buat thread + comment + reply
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

      const postReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'Balasan' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const replyId = JSON.parse(postReply.payload).data.addedReply.id;

      const delRes = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const delJson = JSON.parse(delRes.payload);

      expect(delRes.statusCode).toBe(200);
      expect(delJson.status).toBe('success');
    });

    it('should response 404 when reply id invalid', async () => {
      const res = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-123/comments/comment-123/replies/reply-notfound`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = JSON.parse(res.payload);

      expect(res.statusCode).toBe(404);
      expect(json.status).toBe('fail');
      expect(json.message).toBeDefined();
    });

    // bisa tambah test 403 ketika bukan owner
  });
});
