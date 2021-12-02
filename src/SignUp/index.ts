import { CognitoIdentityServiceProvider } from "aws-sdk";
import AWS from "aws-sdk";

exports.handler = async (ev: any) => {
  const body = JSON.parse(ev.body);

  const cognito = new CognitoIdentityServiceProvider();
  try {
    await cognito
      .signUp({
        ClientId: "1j97f8a755t1qq9hsmeelpukq0",
        Username: body.username,
        Password: body.password,
      })
      .promise();
  } catch (err: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Sign Up Success" }),
  };
};
