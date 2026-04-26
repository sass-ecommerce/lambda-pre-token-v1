
import { helloService } from '../../src/hello/hello.service';

describe('helloService', () => {
  it('returns the welcome message', () => {
    const result = helloService();
    expect(result).toEqual({
      message: 'Go Serverless v4! Your function executed successfully!',
    });
  });
});
