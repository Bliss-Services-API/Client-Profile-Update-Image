'use strict';

const crypto = require('crypto');
const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");

module.exports.app = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    let clientImageFilePath;

    try {
        const region = 'us-east-2';
        const S3Client = new S3(region);

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