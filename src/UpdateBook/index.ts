import AWS, { Schemas } from "aws-sdk";
import joi, { any, options } from "joi";
import { v4 as uuid } from "uuid";

exports.handler = async function (ev: any) {
  const schema = joi.object({
    id: joi.string().trim().required(),
    title: joi.string().trim().required(),
    authorName: joi.string().trim().required(),
    publishedAt: joi.number().required(),
    createdAt: joi.number().required(),
    updatedAt: joi.number().required(),
  }).options({abortEarly: false});
  const db = new AWS.DynamoDB.DocumentClient();
  const id = ev.pathParameters.id;
  let body = JSON.parse(ev.body);
  body.updatedAt = new Date().getTime();
  body.id = id;
  
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

  const update = {...item, ...body};
  let value: any;
  try {
    value = await schema.validateAsync(update);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err }),
    };
  }
  
  await db
    .put({
      TableName: "Books",
      Item: value,
      ConditionExpression: "attribute_exists(id)",
    })
    .promise();
  return {
    statusCode: 200,
    body: JSON.stringify({ id: value }),
  };
};
