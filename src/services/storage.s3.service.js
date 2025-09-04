const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

class S3Storage {
  async upload(file, folder = "uploads") {
    const fileStream = fs.createReadStream(file.path);
    const key = `${folder}/${Date.now()}_${path.basename(file.originalname)}`;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
      ACL: "private"
    };

    const res = await s3.upload(params).promise();
    fs.unlinkSync(file.path);
    return { url: res.Location, key };
  }
}

module.exports = new S3Storage();
