import { CognitoIdentityServiceProvider } from "aws-sdk";

exports.handler = async (ev: any) => {
  const body = JSON.parse(ev.body);
  
  const cognito = new CognitoIdentityServiceProvider();
  let result: any;
  try {
    result = await cognito
      .initiateAuth({
        ClientId: "1j97f8a755t1qq9hsmeelpukq0",
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: body.username,
          PASSWORD: body.password,
        },
      })
      .promise();
  } catch (err: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message }),
    };
  }
  const idToken = result.AuthenticationResult?.IdToken;
  const accessToken = result.AuthenticationResult?.AccessToken;
  const refreshToken = result.AuthenticationResult?.RefreshToken;

  return {
    statusCode: 200,
    body: JSON.stringify({ idToken, accessToken, refreshToken }),
  };
};
