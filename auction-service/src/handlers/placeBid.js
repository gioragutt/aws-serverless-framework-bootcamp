import { Forbidden } from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import { getAuctionById } from '../lib/getAuctionById';
import { updateBidAmount } from '../lib/updatedBidAmount';

async function placeBid(event) {
  const { pathParameters: { id }, body: { amount } } = event;

  const auction = await getAuctionById(id);

  if (auction.status === 'CLOSED') {
    throw new Forbidden(`You cannot bid on closed auctions!`);
  }

  if (auction.highestBid.amount >= amount) {
    throw new Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`);
  }

  const updatedAuction = await updateBidAmount(auction, amount);

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid);
