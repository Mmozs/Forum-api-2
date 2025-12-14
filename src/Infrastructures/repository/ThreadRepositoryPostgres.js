const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor({ pool, idGenerator }) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread({ id, title, body, owner }) {
        const threadId = id || `thread-${this._idGenerator()}`;
        
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads (id, title, body, owner, date) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [threadId, title, body, owner, date],
        };

        return (await this._pool.query(query)).rows[0];
    }

    async verifyThreadExists(threadId) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [threadId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('THREAD_REPOSITORY.THREAD_NOT_FOUND');
        }
    }

    async getThreadById(threadId) {
        const query = {
            text: `SELECT t.id, t.title, t.body, t.date AS date, u.username
                   FROM threads t
                   JOIN users u ON t.owner = u.id
                   WHERE t.id = $1`,
            values: [threadId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('THREAD_REPOSITORY.THREAD_NOT_FOUND');
        }
        return result.rows[0];
    }

    async getThreadDetail(threadId) {
        const query = {
            text: `SELECT t.id, t.title, t.body, t.date, u.username
                   FROM threads t
                   JOIN users u ON t.owner = u.id
                   WHERE t.id = $1`,
            values: [threadId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new Error('THREAD_REPOSITORY.THREAD_NOT_FOUND');
        }
        return result.rows[0];
    }
}

module.exports = ThreadRepositoryPostgres;
