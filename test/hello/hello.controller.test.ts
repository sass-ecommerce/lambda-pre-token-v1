
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { hello } from '../../src/hello/hello.controller';

const mockEvent = {} as APIGatewayProxyEventV2;

describe('hello controller', () => {
  it('returns status 200', async () => {
    const result = await hello(mockEvent);
    expect(result).toMatchObject({ statusCode: 200 });
  });

  it('body contains the welcome message', async () => {
    const result = await hello(mockEvent);
    const body = JSON.parse((result as { body: string }).body);
    expect(body).toHaveProperty('message');
  });
});
