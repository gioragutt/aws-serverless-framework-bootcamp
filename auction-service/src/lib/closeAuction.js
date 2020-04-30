import AWS from 'aws-sdk';
import { dynamodb, TableName } from './db';

const sqs = new AWS.SQS();

export async function closeAuction(auction) {
  await updateAuctionInDb(auction);
  if (auction.highestBid.bidder) {
    await sendMailWhenAuctionHasBid(auction);
  } else {
    await sendMailWhenAuctionHasNoBid(auction);
  }
}

async function updateAuctionInDb(auction) {
  await dynamodb.update({
    TableName,
    Key: { id: auction.id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'CLOSED',
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  }).promise();
}

async function sendMailWhenAuctionHasBid({ title, seller, highestBid: { bidder, amount } }) {
  const notifyBidder = sqs.sendMessage({
    QueueUrl: process.env.MAIL_QUEUE_URL,
    MessageBody: JSON.stringify({
      recipient: bidder,
      subject: `Congratulations on winning the bid on "${title}"! 🥳`,
      body: `
      Congratulations! 🎉
      You're the highest bidder for "${title}"!
      Your bid was $${amount}!
      `
    }),
  }).promise();

  const notifySeller = sqs.sendMessage({
    QueueUrl: process.env.MAIL_QUEUE_URL,
    MessageBody: JSON.stringify({
      recipient: seller,
      subject: `Your item "${title}" has been sold! 🥳`,
      body: `
      Congratulations! 🎉
      Your item "${title}" has been sold!
      It was sold for $${amount}! 🤑
      `
    }),
  }).promise();

  await Promise.all([notifyBidder, notifySeller]);
}

async function sendMailWhenAuctionHasNoBid({ title, seller, highestBid: { bidder, amount } }) {
  await sqs.sendMessage({
    QueueUrl: process.env.MAIL_QUEUE_URL,
    MessageBody: JSON.stringify({
      recipient: seller,
      subject: `Your item ${title} had no bidders 🙁`,
      body: `Better luck next time!`
    }),
  }).promise();
}