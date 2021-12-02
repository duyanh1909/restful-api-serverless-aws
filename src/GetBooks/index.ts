import AWS from "aws-sdk";

exports.handler = async function (ev: any) {
  const db = new AWS.DynamoDB.DocumentClient();
  const { Items: item } = await db
    .scan({
      TableName: "Books",
    })
    .promise();
  return {
    statusCode: 200,
    body: JSON.stringify(item || []),
  };
};