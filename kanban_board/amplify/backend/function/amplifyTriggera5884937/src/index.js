import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "kanban-sim";

export const handler = async (event, context) => {
    
  let body;
  let statusCode = 200;
  const headers = {
    'Access-Control-Allow-Origin': '*',  
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',  
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      // 카드 등록
      case "POST api/cards":
        var requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: requestJSON.id,
              title: requestJSON.title,
              category: requestJSON.category,
            },
          })
        );
        body = `Post item ${requestJSON.id}`;
        break;
        
      // 특정 카드 삭제
      case "DELETE api/cards/{id}":
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
        
      // 모든 카드 조회
      case "GET api/cards":
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
        
      // 카드 변경
      case "PUT api/cards/{id}":
        requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: event.pathParameters.id,
              title: requestJSON.title,
              category: requestJSON.category,
            },
          })
        );
        body = `${requestJSON.id} card updated successfully`;
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
