import { getAuctionById } from '../lib/db';
import commonMiddlware from '../lib/commonMiddleware';

async function getAuction(event) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddlware(getAuction);

