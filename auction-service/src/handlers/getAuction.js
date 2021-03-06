import commonMiddleware from '../lib/commonMiddleware';
import { getAuctionById } from '../lib/getAuctionById';

async function getAuction(event) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);

