import { InternalServerError } from 'http-errors';
import { closeAuction } from '../lib/closeAuction';
import { getEndedAuctions } from '../lib/getEndedAuctions';

async function processAuctions() {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map(auction => closeAuction(auction));
    await Promise.all(closePromises);
    return { closed: auctionsToClose.length };
  } catch (e) {
    console.error(e);
    throw new InternalServerError(e);
  }
}

export const handler = processAuctions;