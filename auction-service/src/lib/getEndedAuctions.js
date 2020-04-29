import { dynamodb, TableName } from './db';

export async function getEndedAuctions() {
  const now = new Date();

  const result = await dynamodb.query({
    TableName,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    }
  }).promise();

  return result.Items;
}
