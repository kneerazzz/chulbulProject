const asyncHandler = (requestHandler) => {
    return (rea, res, next) => {
        Promise.resolve(
            requestHandler(req, res, next)
        ).catch((error) => {next(error)})
    }
}

export {asyncHandler}