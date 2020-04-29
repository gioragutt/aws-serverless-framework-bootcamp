import { v4 as uuid } from 'uuid';
import commonMiddleware from '../lib/commonMiddleware';
import { createAuction as createAuctionInDb } from '../lib/db/createAuction';

async function createAuction(event) {
  const { title } = event.body;

  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  };

  await createAuctionInDb(auction);

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction);
