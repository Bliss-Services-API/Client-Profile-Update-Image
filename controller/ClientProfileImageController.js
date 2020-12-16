'use strict'

/**
 * 
 * Controller for Handling Celeb Images in the AWS S3 Bucket.
 * 
 * @param {Sequelize} databaseConnection Sequelize Object, containing the connection for the Database
 * @param {aws-sdk object} S3Client Object containing the AWS S3 reference
 * 
 */
module.exports = (S3Client) => {

    //Initializing Variables
    const clientImageBucket = process.env.CLIENT_IMAGE_BUCKET;
    

    /**
     * 
     * Function to upload celeb image in the S3
     * 
     * @param {stream} imageStream readStream of the image file, uploaded through the multer
     * @param {string} imageFileName Name of the Celeb Image File (.png)
     * @param {string} imageMIMEType MIME of the image upload
     * @returns {string} URL for downloading celeb image from the CDN (cached)
     * 
     */
    const uploadClientImage = async (imageStream, imageFileName, imageMIMEType) => {
        const imageParam = { 
            Bucket: clientImageBucket,
            Key: imageFileName,
            Body: imageStream,
            ContentType: imageMIMEType
        };

        await S3Object.S3.send(new S3Object.S3.PutObjectCommand(imageParam));
        return true;
    };

    return {
        uploadClientImage
    };
}