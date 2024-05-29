class ExpressError extends Error {
    constructor(msg, status) {
        super()
        this.message = msg
        this.statusCode = status
    }
}

module.exports = ExpressError