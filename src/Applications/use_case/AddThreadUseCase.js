class AddThreadUseCase {
    constructor({ threadRepository, idGenerator }) {
        this._threadRepository = threadRepository;
        this._idGenerator = idGenerator;
    }

    async execute(useCasePayload, owner) {
        const { title, body } = useCasePayload;

        if(!title || !body) {
            throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if(typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        if(!owner) {
            throw new Error('ADD_THREAD_USE_CASE.MISSING_OWNER');
        }

        const id = `thread-${this._idGenerator()}`;

        const addedThread = await this._threadRepository.addThread({
            id,
            title, 
            body, 
            owner,
        });

        if(!addedThread || !addedThread.id) {
            throw new Error('ADD_THREAD_USE_CASE.ADD_THREAD_FAILED')
        }

        return addedThread;
    }
}

module.exports = AddThreadUseCase;