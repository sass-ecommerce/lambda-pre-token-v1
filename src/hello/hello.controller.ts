import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { helloService } from './hello.service';

export const hello = async (_event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const data = helloService();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
