"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const joi_1 = __importDefault(require("joi"));
exports.handler = function (ev) {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object({
            id: joi_1.default.string().trim().required(),
            title: joi_1.default.string().trim().required(),
            authorName: joi_1.default.string().trim().required(),
            publishedAt: joi_1.default.number().required(),
            createdAt: joi_1.default.number().required(),
            updatedAt: joi_1.default.number().required(),
        }).options({ abortEarly: false });
        const db = new aws_sdk_1.default.DynamoDB.DocumentClient();
        const id = ev.pathParameters.id;
        let body = JSON.parse(ev.body);
        body.updatedAt = new Date().getTime();
        body.id = id;
        const { Item: item } = yield db
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
        const update = Object.assign(Object.assign({}, item), body);
        let value;
        try {
            value = yield schema.validateAsync(update);
        }
        catch (err) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: err }),
            };
        }
        yield db
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
    });
};
