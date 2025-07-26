const ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode,
        this.data = data,
        this.message = message || "Successfull",
        this.success = statusCode < 400
    }
}

export {ApiResponse};