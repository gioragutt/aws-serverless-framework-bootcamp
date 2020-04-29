import validator from '@middy/validator';
import { Forbidden } from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import { getAuctionById } from '../lib/getAuctionById';
import { placeBidSchema } from '../lib/schemas/placeBidSchema';
import { updateBidAmount } from '../lib/updatedBidAmount';

async function placeBid(event) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email: bidder } = event.requestContext.authorizer;

  const auction = await getAuctionById(id);

  if (auction.status === 'CLOSED') {
    throw new Forbidden(`You cannot bid on closed auctions!`);
  }

  if (auction.seller === bidder) {
    throw new Forbidden('You cannot bid on your own auction!');
  }

  if (auction.highestBid.bidder === bidder) {
    throw new Forbidden('You are already the highest bidder!');
  }

  if (auction.highestBid.amount >= amount) {
    throw new Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`);
  }

  const updatedAuction = await updateBidAmount(auction, amount, bidder);

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid)
  .use(validator({ inputSchema: placeBidSchema }));
