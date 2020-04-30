import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: process.env.REGION });

async function sendMail(event, context) {
  const [record] = event.Records;
  console.log('record processing', record);

  const { subject, body, recipient } = JSON.parse(record.body);

  try {
    const result = await ses.sendEmail({
      Source: 'giora111@gmail.com',
      Destination: {
        ToAddresses: [recipient],
      },
      Message: {
        Body: {
          Text: {
            Data: body,
          },
        },
        Subject: {
          Data: subject,
        },
      },
    }).promise();
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

export const handler = sendMail;
