import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { UserItem } from './preToken.types';

const defaultDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.USERS_TABLE_NAME!;

export const buildClaims = async (
  userId: string,
  docClient = defaultDocClient,
): Promise<Record<string, string>> => {
  const { Item } = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: userId },
    }),
  );

  const firstTenant = (Item as UserItem | undefined)?.tenants?.[0];

  if (!firstTenant) {
    return {};
  }

  return { tenantId: firstTenant.tenantId };
};
