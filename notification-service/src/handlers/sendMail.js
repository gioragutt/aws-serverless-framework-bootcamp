import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: process.env.REGION });

async function sendMail(event, context) {
  try {
    const result = await ses.sendEmail({
      Source: 'source@email.com',
      Destination: {
        ToAddresses: ['detination@email.com'],
      },
      Message: {
        Body: {
          Text: {
            Data: `Hello from giorag 🥳 (Body)`
          },
        },
        Subject: {
          Data: `Hello from giorag 🥳 (Subject)`
        },
      },
    }).promise();
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

export const handler = sendMail;
