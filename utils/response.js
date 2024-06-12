class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError'
    }
}

function SuccessReq(res, message, data = {}, code = 200) {
    res.status(code).json({
        status: true,
        message,
        data
    })

}

function FailureReq(res, error) {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message)
        return res.status(400).json({
            status: false,
            message: "请求参数错误",
            errors
        })
    }
    if (error.name === 'NotFoundError') {
        const errors = error.errors.map(e => e.message)
        return res.status(404).json({
            status: false,
            message: "资源不存在",
            errors: [error.message]
        })
    }
    return res.status(500).json({
        status: false,
        message: "服务器错误",
        errors: [error.message]
    })
}

module.exports = {
    NotFoundError,
    SuccessReq,
    FailureReq
}