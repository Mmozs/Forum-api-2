// src/Infrastructures/repository/_test/ReplyRepositoryPostgres.test.js

const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  const fakeIdGenerator = () => '999';
  let mockPool;
  let repo;

  beforeEach(() => {
    mockPool = {
      query: jest.fn(),
    };
    repo = new ReplyRepositoryPostgres({
      pool: mockPool,
      idGenerator: fakeIdGenerator,
    });
  });

  describe('addReply', () => {
    it('should insert a reply and return the added reply data', async () => {
      // Arrange
      const commentId = 'comment-123';
      const content = 'Balasan';
      const owner = 'user-abc';
      const fakeDate = new Date().toISOString();
      const fakeId = `reply-${fakeIdGenerator()}`;

      mockPool.query.mockResolvedValue({
        rows: [
          { id: fakeId, content, owner }
        ],
      });

      // Act
      const added = await repo.addReply({ commentId, content, owner });

      // Assert
      expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({
        text: expect.stringContaining('INSERT INTO replies'),
        values: [fakeId, commentId, content, owner, expect.any(String)],
      }));
      expect(added).toEqual({
        id: fakeId,
        content,
        owner,
      });
    });
  });

  describe('verifyReplyExists', () => {
    it('should not throw error when reply exists', async () => {
      // Arrange
      mockPool.query.mockResolvedValue({ rowCount: 1, rows: [{ id: 'reply-999' }] });

      // Act & Assert
      await expect(repo.verifyReplyExists('reply-999'))
        .resolves.not.toThrow();
      expect(mockPool.query).toHaveBeenCalledWith({
        text: 'SELECT id FROM replies WHERE id = $1',
        values: ['reply-999'],
      });
    });

    it('should throw error when reply does not exist', async () => {
      // Arrange
      mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

      // Act & Assert
      await expect(repo.verifyReplyExists('reply-123'))
        .rejects.toThrow('REPLY_REPOSITORY.REPLY_NOT_FOUND');
    });
  });

  describe('verifyReplyOwner', () => {
    it('should not throw if the owner is correct', async () => {
      // Arrange
      const replyId = 'reply-999';
      const owner = 'user-xyz';
      mockPool.query.mockResolvedValue({
        rows: [{ owner }],
      });

      // Act & Assert
      await expect(repo.verifyReplyOwner(replyId, owner))
        .resolves.not.toThrow();
      expect(mockPool.query).toHaveBeenCalledWith({
        text: 'SELECT owner FROM replies WHERE id = $1',
        values: [replyId],
      });
    });

    it('should throw if the owner is incorrect', async () => {
      // Arrange
      mockPool.query.mockResolvedValue({
        rows: [{ owner: 'someone-else' }],
      });

      // Act & Assert
      await expect(repo.verifyReplyOwner('reply-999', 'user-xyz'))
        .rejects.toThrow('REPLY_REPOSITORY.NOT_THE_REPLY_OWNER');
    });
  });

  describe('deleteReply', () => {
    it('should mark a reply as deleted', async () => {
      // Arrange
      const replyId = 'reply-999';
      mockPool.query.mockResolvedValue({});

      // Act
      await repo.deleteReply(replyId);

      // Assert
      expect(mockPool.query).toHaveBeenCalledWith({
        text: 'UPDATE replies SET is_delete = true WHERE id = $1',
        values: [replyId],
      });
    });
  });

  describe('getRepliesByCommentsId', () => {
    it('should return raw replies data', async () => {
      const commentIds = ['comment-1', 'comment-2'];
      const fakeRows = [
        {
          id: 'reply-1',
          comment_id: 'comment-1',
          content: 'Halo',
          date: '2025-01-01T00:00:00.000Z',
          username: 'userA',
          is_delete: false,
        },
        {
          id: 'reply-2',
          comment_id: 'comment-2',
          content: 'Dunia',
          date: '2025-01-02T00:00:00.000Z',
          username: 'userB',
          is_delete: false,
        },
      ];
      mockPool.query.mockResolvedValue({ rows: fakeRows });

      const replies = await repo.getRepliesByCommentsId(commentIds);

      expect(mockPool.query).toHaveBeenCalledWith({
        text: expect.stringContaining('SELECT r.id'),
        values: [commentIds],
      });
      expect(replies).toEqual(fakeRows);
    });

    it('should return raw data including is_delete field', async () => {
      const commentIds = ['comment-1'];
      const fakeRows = [
        {
          id: 'reply-3',
          comment_id: 'comment-1',
          content: 'Rahasia',
          date: '2025-01-03T00:00:00.000Z',
          username: 'userC',
          is_delete: true,
        },
      ];
      mockPool.query.mockResolvedValue({ rows: fakeRows });

      const replies = await repo.getRepliesByCommentsId(commentIds);

      expect(replies).toEqual(fakeRows);
    });
  });
});
