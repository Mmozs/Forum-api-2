// src/Infrastructures/repository/_test/CommentRepositoryPostgres.test.js

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  const fakeIdGen = () => '001';
  let mockPool;
  let repository;

  beforeEach(() => {
    mockPool = {
      query: jest.fn(),
    };
    repository = new CommentRepositoryPostgres({
      pool: mockPool,
      idGenerator: fakeIdGen,
    });
  });

  describe('addComment', () => {
    it('should insert comment and return added comment correctly', async () => {
      // Arrange
      const fakeThreadId = 'thread-1';
      const fakeContent = 'ini komentar';
      const fakeOwner = 'user-1';
      const fakeDate = new Date().toISOString();
      const fakeId = `comment-${fakeIdGen()}`;

      // Mock return dari pool.query
      mockPool.query.mockResolvedValue({
        rows: [
          { id: fakeId, content: fakeContent, owner: fakeOwner }
        ],
      });

      // Act
      const added = await repository.addComment({
        threadId: fakeThreadId,
        content: fakeContent,
        owner: fakeOwner,
      });

      // Assert
      expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({
        text: expect.stringContaining('INSERT INTO comments'),
        values: [fakeId, fakeThreadId, fakeContent, fakeOwner, expect.any(String)],
      }));
      expect(added).toEqual({
        id: fakeId,
        content: fakeContent,
        owner: fakeOwner,
      });
    });
  });

  describe('verifyCommentExists', () => {
    it('should not throw if comment exists', async () => {
      // Arrange
      mockPool.query.mockResolvedValue({ rowCount: 1, rows: [{ id: 'comment-001' }] });

      // Act & Assert
      await expect(repository.verifyCommentExists('comment-001')).resolves.not.toThrow();
      expect(mockPool.query).toHaveBeenCalledWith({
        text: 'SELECT id FROM comments WHERE id = $1',
        values: ['comment-001'],
      });
    });

    it('should throw error if comment does not exist', async () => {
      // Arrange
      mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

      // Act & Assert
      await expect(repository.verifyCommentExists('comment-002'))
        .rejects.toThrow('COMMENT_REPOSITORY.COMMENT_NOT_FOUND');
    });
  });

  describe('verifyCommentOwner', () => {
    it('should not throw if owner is correct', async () => {
      // Arrange
      const commentId = 'comment-001';
      const owner = 'user-1';
      mockPool.query.mockResolvedValue({
        rowCount: 1,
        rows: [{ id: commentId }],
      });

      // Act & Assert
      await expect(repository.verifyCommentOwner(commentId, owner))
        .resolves.not.toThrow();
      expect(mockPool.query).toHaveBeenCalledWith({
        text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
        values: [commentId, owner],
      });
    });

    it('should throw if owner is incorrect', async () => {
      // Arrange
      const commentId = 'comment-002';
      mockPool.query.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      // Act & Assert
      await expect(repository.verifyCommentOwner(commentId, 'user-1'))
        .rejects.toThrow('COMMENT_REPOSITORY.NOT_THE_COMMENT_OWNER');
    });
  });

  describe('deleteComment', () => {
    it('should mark comment as deleted (is_delete = true)', async () => {
      // Arrange
      const commentId = 'comment-003';

      mockPool.query.mockResolvedValue({});

      // Act
      await repository.deleteComment(commentId);

      // Assert
      expect(mockPool.query).toHaveBeenCalledWith({
        text: 'UPDATE comments SET is_delete = true WHERE id = $1',
        values: [commentId],
      });
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return raw comments data', async () => {
      const threadId = 'thread-10';
      const fakeRows = [
        {
          id: 'comment-10a',
          content: 'Hello',
          date: '2025-01-01T00:00:00.000Z',
          username: 'user10',
          is_delete: false,
        },
        {
          id: 'comment-10b',
          content: 'World',
          date: '2025-01-02T00:00:00.000Z',
          username: 'user20',
          is_delete: false,
        },
      ];
      mockPool.query.mockResolvedValue({ rows: fakeRows });

      const comments = await repository.getCommentsByThreadId(threadId);

      expect(mockPool.query).toHaveBeenCalledWith({
        text: expect.stringContaining('SELECT c.id'),
        values: [threadId],
      });
      expect(comments).toEqual(fakeRows);
    });

    it('should return raw data including is_delete field', async () => {
      const threadId = 'thread-10';
      const fakeRows = [
        {
          id: 'comment-10c',
          content: 'Secret',
          date: '2025-01-03T00:00:00.000Z',
          username: 'user30',
          is_delete: true,
        },
      ];
      mockPool.query.mockResolvedValue({ rows: fakeRows });

      const comments = await repository.getCommentsByThreadId(threadId);

      expect(comments).toEqual(fakeRows);
    });
  });
});
