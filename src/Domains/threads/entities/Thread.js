class Thread {
    constructor({ id, title, body, owner, date }){
        this._verifyPayload({ id, title, body, owner, date });
        this.id = id;
        this.title = title;
        this.body = body;
        this.owner = owner;
        this.date = date;
    }

    _verifyPayload({ id, title, body, owner, date }){
        if (!id || !title || !body || !owner || !date) {
            throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
         }
         if (typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
         }
   }
}
module.exports = Thread;