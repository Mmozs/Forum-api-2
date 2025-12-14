const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
    it('should throw error when addThread method is not implemented', async () => {
        const repo = new ThreadRepository();
        await expect(repo.addThread({ title: 'a', body: 'b', owner: 'u1'}))
          .rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });

    it('should throw error when verifyThreadExists method is not implemented', async () => {
        const repo = new ThreadRepository();
        await expect(repo.verifyThreadExists('thread-1'))
          .rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
    it('should throw error when getThreadDetail method is not implemented', async () => {
        const repo = new ThreadRepository();
        await expect(repo.getThreadDetail('thread-1'))
          .rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});