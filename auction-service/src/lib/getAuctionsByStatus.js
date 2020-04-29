import { dynamodb, TableName } from './db';

export async function getAuctionsByStatus(status) {
  const result = await dynamodb.query({
    TableName,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    }
  }).promise();

  return result.Items;
}
