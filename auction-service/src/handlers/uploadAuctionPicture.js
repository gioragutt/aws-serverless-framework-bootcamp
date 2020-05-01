import commonMiddleware from '../lib/commonMiddleware';
import { updateAuctionPicture } from '../lib/uploadAuctionPicture';
import { getAuctionById } from '../lib/getAuctionById';

async function uploadAuctionPicture(event) {
  const auction = await getAuctionById(event.pathParameters.id);
  const updatedAuction = await updateAuctionPicture(auction, event.body);

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(uploadAuctionPicture);

