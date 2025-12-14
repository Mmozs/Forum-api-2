// src/Applications/use_case/_test/GetThreadDetailUseCase.test.js
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should throw error when threadId not provided', async () => {
    const useCase = new GetThreadDetailUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    await expect(useCase.execute())
      .rejects.toThrow('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });

  it('should throw error when threadId not string', async () => {
    const useCase = new GetThreadDetailUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    await expect(useCase.execute(123))
      .rejects.toThrow('GET_THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return thread detail with empty comments', async () => {
    const mockThread = {
      id: 'thread-125',
      title: 'Title 125',
      body: 'Body 125',
      date: '2024-01-01T00:00:00Z',
      username: 'user125',
    };
    const mockThreadRepository = {
      getThreadDetail: jest.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: jest.fn().mockResolvedValue([]),
    };
    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: {},
    });

    const result = await useCase.execute('thread-125');

    expect(result.comments).toEqual([]);
    expect(mockThreadRepository.getThreadDetail).toHaveBeenCalledWith('thread-125');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-125');
  });

  it('should return thread detail with comments and replies', async () => {
    const mockThread = {
      id: 'thread-126',
      title: 'Title',
      body: 'Body',
      date: '2024-01-01T00:00:00Z',
      username: 'user1',
    };
    const mockComments = [
      { id: 'comment-1', username: 'user2', date: '2024-01-01T01:00:00Z', content: 'Comment 1', is_delete: false },
      { id: 'comment-2', username: 'user3', date: '2024-01-01T02:00:00Z', content: 'Comment 2', is_delete: false },
    ];
    const mockReplies = [
      { id: 'reply-1', comment_id: 'comment-1', username: 'user4', date: '2024-01-01T03:00:00Z', content: 'Reply 1', is_delete: false },
      { id: 'reply-2', comment_id: 'comment-1', username: 'user5', date: '2024-01-01T04:00:00Z', content: 'Reply 2', is_delete: false },
    ];
    const mockThreadRepository = {
      getThreadDetail: jest.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: jest.fn().mockResolvedValue(mockComments),
    };
    const mockReplyRepository = {
      getRepliesByCommentsId: jest.fn().mockResolvedValue(mockReplies),
    };
    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const result = await useCase.execute('thread-126');

    expect(result.comments[0].replies).toEqual([
      { id: 'reply-1', username: 'user4', date: '2024-01-01T03:00:00Z', content: 'Reply 1' },
      { id: 'reply-2', username: 'user5', date: '2024-01-01T04:00:00Z', content: 'Reply 2' },
    ]);
    expect(result.comments[1].replies).toEqual([]);
    expect(mockReplyRepository.getRepliesByCommentsId).toHaveBeenCalledWith(['comment-1', 'comment-2']);
  });

  it('should handle deleted comments and replies correctly', async () => {
    const mockThread = {
      id: 'thread-127',
      title: 'Title',
      body: 'Body',
      date: '2024-01-01T00:00:00Z',
      username: 'user1',
    };
    const mockComments = [
      { id: 'comment-1', username: 'user2', date: '2024-01-01T01:00:00Z', content: 'Deleted Comment', is_delete: true },
      { id: 'comment-2', username: 'user3', date: '2024-01-01T02:00:00Z', content: 'Normal Comment', is_delete: false },
    ];
    const mockReplies = [
      { id: 'reply-1', comment_id: 'comment-1', username: 'user4', date: '2024-01-01T03:00:00Z', content: 'Deleted Reply', is_delete: true },
      { id: 'reply-2', comment_id: 'comment-2', username: 'user5', date: '2024-01-01T04:00:00Z', content: 'Normal Reply', is_delete: false },
    ];
    const mockThreadRepository = {
      getThreadDetail: jest.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: jest.fn().mockResolvedValue(mockComments),
    };
    const mockReplyRepository = {
      getRepliesByCommentsId: jest.fn().mockResolvedValue(mockReplies),
    };
    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const result = await useCase.execute('thread-127');

    expect(result.comments[0].content).toEqual('**komentar telah dihapus**');
    expect(result.comments[1].content).toEqual('Normal Comment');
    expect(result.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
    expect(result.comments[1].replies[0].content).toEqual('Normal Reply');
  });
});
