import jwt from 'jsonwebtoken';

const createAllowedResource = methodArn => {
  const stagePart = `/${process.env.STAGE}/`;

  const allEndpointsInGatewayWildcard =
    `${methodArn.split(stagePart)[0]}${stagePart}*`;

  return allEndpointsInGatewayWildcard;
};

const generatePolicy = (principalId, methodArn) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: createAllowedResource(methodArn),
        },
      ],
    },
  };
};

export async function handler(event) {
  if (!event.authorizationToken) {
    throw 'Unauthorized';
  }

  const token = event.authorizationToken.replace('Bearer ', '');

  try {
    const claims = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);
    const policy = generatePolicy(claims.sub, event.methodArn);

    return {
      ...policy,
      context: claims
    };
  } catch (error) {
    console.log(error);
    throw 'Unauthorized';
  }
};