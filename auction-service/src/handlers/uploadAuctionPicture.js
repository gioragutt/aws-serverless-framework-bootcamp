async function uploadAuctionPicture(event) {
  const { id } = event.pathParameters;

  console.log(`Uploading picture for ${id}`);

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

export const handler = uploadAuctionPicture;

