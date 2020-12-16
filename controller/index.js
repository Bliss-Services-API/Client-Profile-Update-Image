module.exports = (S3Object) => {
    const clientImageController = require('./ClientProfileImageController')(S3Object);
    const clientMultipartParseController = require('./ClientMultipartParseController')();

    return {
        clientImageController,
        clientMultipartParseController
    };
}