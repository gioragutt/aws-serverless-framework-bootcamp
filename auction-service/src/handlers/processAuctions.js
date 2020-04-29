import { getEndedAuctions } from '../lib/db/getEndedAuctions';

async function processAuctions() {
  const auctionsToClose = await getEndedAuctions();
  console.log(auctionsToClose);
}

export const handler = processAuctions;