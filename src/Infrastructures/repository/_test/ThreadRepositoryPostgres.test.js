const pool = require('../../database/postgres/pool');
const ThreadRepository = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    afterAll(async () => {
        await pool.end();
    });

    
    it('should add thread and return added thread data correctly', async () => {
        // Arrange
        await pool.query('DELETE FROM comments');
        await pool.query('DELETE FROM threads');
        await pool.query('DELETE FROM users');
        const fakeGenId = () => '123'; //stub
        const ThreadRepo = new ThreadRepository({ pool, idGenerator: fakeGenId });
        await pool.query("INSERT INTO users(id, username, password, fullname) VALUES('user-1', 'username1', 'password1', 'first user')");

        // Action
        const addedThread = await ThreadRepo.addThread({ title: 'Judul Thread', body: 'b', owner: 'user-1'});

        // Assert
        expect(addedThread.id).toEqual('thread-123');
        expect(addedThread.title).toEqual('Judul Thread');
        expect(addedThread.owner).toEqual('user-1');

        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: ['thread-123'],
        };
        const result = await pool.query(query);
        expect(result.rows).toHaveLength(1);
    });

    it('should throw error when thread to verify does not exist', async () => {
        // Arrange
        await pool.query('DELETE FROM comments');
        await pool.query('DELETE FROM threads');
        await pool.query('DELETE FROM users');

        await pool.query("INSERT INTO users(id, username, password, fullname) VALUES('user-2', 'username2', 'password2', 'second user')");

        const fakeIdGen = () => '124'; //stub
        const ThreadRepo = new ThreadRepository({ pool, idGenerator: fakeIdGen });
        await ThreadRepo.addThread({ title: 'Another Thread', body: 'b', owner: 'user-2'});

        // Action & Assert
        await expect(ThreadRepo.verifyThreadExists('thread-124'))
          .resolves.toBeUndefined();
        
        await expect(ThreadRepo.verifyThreadExists('thread-invalid'))
          .rejects
          .toThrow('THREAD_REPOSITORY.THREAD_NOT_FOUND');
    });

    it('should get thread detail correctly', async () => {
        await pool.query('DELETE FROM comments');
        await pool.query('DELETE FROM threads');
        await pool.query('DELETE FROM users');
        const fakeIdGen = () => '125';
        const ThreadRepo = new ThreadRepository({ pool, idGenerator: fakeIdGen });
        await pool.query(`INSERT INTO users(id, username, password, fullname) VALUES ('user-125', 'username125', 'password125', 'User 125')`);
        
        await ThreadRepo.addThread({ title: 'Thread Title 125', body: 'Thread Body 125', owner: 'user-125' });
    
        const detail = await ThreadRepo.getThreadDetail('thread-125');
        expect(detail.id).toEqual('thread-125');
        expect(detail.title).toEqual('Thread Title 125');
        expect(detail.body).toEqual('Thread Body 125');
        expect(detail.username).toEqual('username125');
        expect(detail.date).toBeInstanceOf(Date);
    });




    it('should throw error when trying to get detail of non-existing thread', async () => {
        const fakeIdGen = () => '999';
        const ThreadRepo = new ThreadRepository({ pool, idGenerator: fakeIdGen });

        await expect(ThreadRepo.getThreadDetail('thread-invalid'))
          .rejects
          .toThrow('THREAD_REPOSITORY.THREAD_NOT_FOUND');
    });








    it('should get thread by id correctly', async () => {
        await pool.query('DELETE FROM comments');
        await pool.query('DELETE FROM threads');
        await pool.query('DELETE FROM users');
        await pool.query(`INSERT INTO users(id, username, password, fullname) VALUES ('user-900', 'username900', 'password900', 'User 900')`);
        const fakeIdGen = () => '900';
        const ThreadRepo = new ThreadRepository({ pool, idGenerator: fakeIdGen });
        await ThreadRepo.addThread({ title: 'Thread 900', body: 'Body 900', owner: 'user-900' });

        const thread = await ThreadRepo.getThreadById('thread-900');
        expect(thread.id).toEqual('thread-900');
        expect(thread.title).toEqual('Thread 900');
        expect(thread.body).toEqual('Body 900');
        expect(thread.username).toEqual('username900');
    });

    it('should throw error when getting non-existing thread by id', async () => {
        const fakeIdGen = () => '999';
        const ThreadRepo = new ThreadRepository({ pool, idGenerator: fakeIdGen });
        await expect(ThreadRepo.getThreadById('thread-nonexist'))
          .rejects
          .toThrow('THREAD_REPOSITORY.THREAD_NOT_FOUND');
    });
    
});