const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadMaskedPhoto(file, userId) {
  const fileExt = path.extname(file.originalname);

  const fileKey = `profiles/${userId}/${uuidv4()}${fileExt}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  console.log("user id", userId);
  console.log("fileeeee,",file);
  
  
  await s3.upload(params).promise();

  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}

module.exports = { uploadMaskedPhoto };
