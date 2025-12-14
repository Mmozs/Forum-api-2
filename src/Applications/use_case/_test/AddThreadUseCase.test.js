// src/Applications/use_case/_test/AddThreadUseCase.test.js
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const useCase = new AddThreadUseCase({
      threadRepository: {},
      idGenerator: () => '123',
    });

    // Act & Assert
    await expect(useCase.execute({ title: 'OnlyTitle' }, 'owner-1'))
      .rejects.toThrow('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', async () => {
    // Arrange
    const useCase = new AddThreadUseCase({
      threadRepository: {},
      idGenerator: () => '123',
    });

    // Act & Assert
    await expect(useCase.execute({ title: 123, body: true }, 'owner-1'))
      .rejects.toThrow('ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrate add thread action correctly', async () => {
    // Arrange
    const mockThreadRepository = {
      addThread: jest.fn()
        .mockResolvedValue({
          id: 'thread-123',
          title: 'A title',
          owner: 'owner-1',
        }),
    };
    const useCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      idGenerator: () => '123',
    });

    const payload = { title: 'A title', body: 'A body' };
    const owner = 'owner-1';

    // Act
    const addedThread = await useCase.execute(payload, owner);

    // Assert
    expect(addedThread).toStrictEqual({
      id: 'thread-123',
      title: 'A title',
      owner: 'owner-1',
    });
    expect(mockThreadRepository.addThread)
      .toHaveBeenCalledWith({ title: 'A title', body: 'A body', owner: 'owner-1', id: 'thread-123' });
  });
});

  it('should throw error when owner is missing', async () => {
    const useCase = new AddThreadUseCase({
      threadRepository: {},
      idGenerator: () => '123',
    });

    await expect(useCase.execute({ title: 'Title', body: 'Body' }, null))
      .rejects.toThrow('ADD_THREAD_USE_CASE.MISSING_OWNER');
  });

  it('should throw error when addThread fails', async () => {
    const mockThreadRepository = {
      addThread: jest.fn().mockResolvedValue({}),
    };
    const useCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      idGenerator: () => '123',
    });

    await expect(useCase.execute({ title: 'Title', body: 'Body' }, 'owner-1'))
      .rejects.toThrow('ADD_THREAD_USE_CASE.ADD_THREAD_FAILED');
  });
