import { Forbidden } from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import { getAuctionById } from '../lib/getAuctionById';
import { updateAuctionPicture } from '../lib/uploadAuctionPicture';

async function uploadAuctionPicture(event) {
  const auction = await getAuctionById(event.pathParameters.id);

  const { email: uploader } = event.requestContext.authorizer;

  if (auction.seller !== uploader) {
    throw new Forbidden('You can only change your own auctions!');
  }

  const updatedAuction = await updateAuctionPicture(auction, event.body);

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(uploadAuctionPicture);

