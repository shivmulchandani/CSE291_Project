import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "wordcount_table";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "DELETE /items/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /items/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = body.Item;
        break;
      case "GET /items":
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        console.log("WOOO")
        console.log(requestJSON)
        const words = requestJSON.words;
        //const words = objectJSON.list;
        for (const word of words) {
             await dynamo.send(
                 new UpdateCommand({
                     TableName: tableName,
                     Key: { 'id': word, },
                     UpdateExpression: 'SET #attrName = if_not_exists(#attrName, :zero) + :val',
                     ExpressionAttributeNames: {'#attrName': 'count'},
                     ExpressionAttributeValues: {':val': 1, ':zero': 0 },
                     ReturnValues: 'UPDATED_NEW'
                 })
              );
          //console.log("WORD: " + word)
        };
        body = `Put items ${requestJSON.words}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
