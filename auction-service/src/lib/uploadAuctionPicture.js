import AWS from 'aws-sdk';
import { BadRequest, InternalServerError } from 'http-errors';
import { dynamodb, TableName } from './db';

const s3 = new AWS.S3();
const bucketName = process.env.AUCTIONS_BUCKET_NAME;

export async function updateAuctionPicture(auction, pictureBase64) {
  if (!pictureBase64) {
    throw new BadRequest('Invalid picture');
  }

  const url = await savePictureInS3(auction, pictureBase64);
  return await updatePictureUrl(auction, url);
}

async function savePictureInS3({ id }, pictureBase64) {
  const { contentType, base64Body } = parseBase64(pictureBase64);

  const body = Buffer.from(base64Body, 'base64');
  const key = `auction/${id}/picture`;

  console.log(`Uploading ${key}, size: ${body.byteLength} bytes`);

  try {
    const { Location } = await s3.upload({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentEncoding: 'base64',
      ContentType: contentType,
    }).promise();

    return Location;
  } catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }
}

async function updatePictureUrl({ id }, pictureUrl) {
  try {
    const result = await dynamodb.update({
      TableName,
      Key: { id },
      UpdateExpression: 'set picture = :picture',
      ExpressionAttributeValues: {
        ':picture': pictureUrl,
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    return result.Attributes;
  } catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }
}

function parseBase64(base64) {
  // base64 = data:<content type>;base64,<base 64 body>
  const [metadata, base64Body] = base64.split(';base64,', 2);
  const contentType = metadata.split(':')[1];

  if (!contentType || !base64Body) {
    throw new BadRequest('Invalid picture');
  }

  return { base64Body, contentType };
}