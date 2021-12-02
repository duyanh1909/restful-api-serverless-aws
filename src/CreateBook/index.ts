import AWS from "aws-sdk";
import joi from "joi";
import { v4 as uuid } from "uuid";

exports.handler = async function (ev: any) {
  const schema = joi
    .object({
      id: joi.string().trim().required(),
      title: joi.string().trim().required(),
      authorName: joi.string().trim().required(),
      publishedAt: joi.number().required(),
      createdAt: joi.number().required(),
      updatedAt: joi.number().required(),
    })
    .options({ abortEarly: false });
  const db = new AWS.DynamoDB.DocumentClient();
  let body = JSON.parse(ev.body);
  body.id = uuid();
  body.createdAt = new Date().getTime();
  body.updatedAt = new Date().getTime();

  let value: any;
  try {
    value = await schema.validateAsync(body);
  } catch (err: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err }),
    };
  }

  await db
    .put({
      TableName: "Books",
      Item: value,
      ConditionExpression: "attribute_not_exists(id)",
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ id: value.id }),
  };
};
