import AWS from "aws-sdk";

exports.handler = async function (ev: any) {
  const db = new AWS.DynamoDB.DocumentClient();
  const id = ev.pathParameters.id;
  const { Item: item } = await db
    .get({
      TableName: "Books",
      Key: {
        id: id,
      },
    })
    .promise();
  if (!item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not Found ID book" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};