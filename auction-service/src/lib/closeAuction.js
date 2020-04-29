import { dynamodb, TableName } from './db';

export async function closeAuction(auction) {
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