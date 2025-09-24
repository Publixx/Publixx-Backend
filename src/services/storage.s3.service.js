const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

/**
 * Upload masked profile photo
 * stored under: profiles/{userId}/{uuid}.{ext}
 */
async function uploadMaskedPhoto(file, userId) {
  const fileExt = path.extname(file.originalname);
  const fileKey = `profiles/${userId}/${uuidv4()}${fileExt}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  console.log("Uploading profile photo for user:", userId);

  await s3.upload(params).promise();

  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}

async function deleteMaskedPhoto(url) {
  if (!url) return;

  try {
    // Extract the key from the URL
    const urlObj = new URL(url);
    const fileKey = urlObj.pathname.substring(1); // remove leading /

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey,
    };

    console.log("Deleting old profile photo:", fileKey);
    await s3.deleteObject(params).promise();
  } catch (err) {
    console.error("❌ Failed to delete S3 object:", err.message);
  }
}

/**
 * Upload submission (image/video) for a game stage
 * stored under: submissions/{stageId}/{userId}/{uuid}.{ext}
 */
async function uploadSubmission(file, stageId, userId) {
  const fileExt = path.extname(file.originalname);
  const fileKey = `submissions/${stageId}/${userId}/${uuidv4()}${fileExt}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  console.log(`Uploading submission for user ${userId}, stage ${stageId}`);

  await s3.upload(params).promise();

  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}

module.exports = {
  uploadMaskedPhoto,
  deleteMaskedPhoto,
  uploadSubmission,
};
