'use strict';

/**
 * 
 * Lambda Function for signing clients and generating JWT token for them. This is the server, which is
 * acessible to the clients for signin up, and is the only service available for them without token
 * authorization
 * 
 * @param {API Gateway Event Object} event Object related to the request being sent through the API Gateway Proxy
 * @param {Env Runtime Variables / Object} context Objects related to the runtime env of the server, lambda is running within
 * 
 */
module.exports.app = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let clientImageFilePath;

    try {
        const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");
        const region = 'us-east-2';
        const S3Client = new S3(region);
        const crypto = require('crypto');

        const Controller = require('./controller')({S3Client, PutObjectCommand});
        const clientImageController = Controller.clientImageController;
        const clientMultipartParseController = Controller.clientMultipartParseController;
    
        const clientData = await clientMultipartParseController(event);

        clientImageFilePath = clientData.files.filePath;
        const clientImageFileStream = fs.createReadStream(clientImageFilePath);
        const imageMIMEType = clientData.files.contentType;
        const clientEmail = clientData.body.client_email;

        const clientEmailSalted = clientEmail + "" + MagicWord;
        const clientId = crypto.createHash('sha256').update(clientEmailSalted).digest('base64');

        const imageFileName = `${clientId}.png`;

        await clientImageController.uploadClientImage(clientImageFileStream, imageFileName, imageMIMEType);
        
        const response = {
            MESSAGE: 'DONE',
            RESPONSE: 'Client Image Updated Successfully!',
            CODE: 'CLIENT_UPDATED_SUCCESSFULLY'
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };

    } catch(err) {
        console.error(`ERR: ${JSON.stringify(err.message)}`);

        const response = {
            ERR: err.message,
            RESPONSE: 'Client Image Upload Failed!',
            CODE: 'CLIENT_UPDATION_FAILED'
        };

        return {
            statusCode: 400,
            body: JSON.stringify(response)
        };
    }

    finally {
        if(clientImageFilePath)
            fs.unlinkSync(clientImageFilePath);
    }
}