import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: 'us-east-1' });
const myEmail = process.env.EMAIL;
const myDomain = process.env.DOMAIN;

function generateResponse(code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(payload),
  };
}

function generateError(code, err) {
  console.log(err);
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(err.message),
  };
}

function generateEmailParams(body) {
  const { email, name, content } = JSON.parse(body);
  console.log(email, name, content);
  if (!(email && name && content)) {
    throw new Error(
      "Missing parameters! Make sure to add parameters 'email', 'name', 'content'."
    );
  }

  return {
    Source: myEmail,
    Destination: { ToAddresses: [myEmail] },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Message sent from email ${email} by ${name} \nContent: ${content}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `You received a message from ${myDomain}!`,
      },
    },
  };
}

export const send = async (event) => {
  try {
    const emailParams = generateEmailParams(event.body);
    const command = new SendEmailCommand(emailParams);
    const data = await sesClient.send(command);
    return generateResponse(200, data);
  } catch (err) {
    return generateError(500, err);
  }
};
