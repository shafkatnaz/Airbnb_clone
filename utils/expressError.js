// this is our custom error express class:
class expressError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}
module.exports = expressError;