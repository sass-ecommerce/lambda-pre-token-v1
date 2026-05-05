
import { PreTokenGenerationV2TriggerEvent } from 'aws-lambda';
import { preToken } from '../../src/preToken/preToken.controller';
import { buildClaims } from '../../src/preToken/preToken.service';

jest.mock('../../src/preToken/preToken.service');

const mockBuildClaims = buildClaims as jest.MockedFunction<typeof buildClaims>;

const mockEvent: PreTokenGenerationV2TriggerEvent = {
  version: '2',
  triggerSource: 'TokenGeneration_Authentication',
  region: 'us-east-1',
  userPoolId: 'us-east-1_test',
  userName: 'test-user',
  callerContext: { awsSdkVersion: '1.0', clientId: 'test-client' },
  request: {
    userAttributes: { sub: 'test-sub', 'custom:id': 'test-user-id', email: 'test@example.com' },
    groupConfiguration: {},
    scopes: [],
  },
  response: { claimsAndScopeOverrideDetails: {} },
};

describe('preToken controller', () => {
  beforeEach(() => mockBuildClaims.mockReset());

  it('passes custom:id and sub from userAttributes to buildClaims', async () => {
    mockBuildClaims.mockResolvedValueOnce({ tenantId: 'uuid-tenant-1' });
    await preToken(mockEvent);
    expect(mockBuildClaims).toHaveBeenCalledWith('test-user-id', 'test-sub');
  });

  it('adds tenantId to accessTokenGeneration claims', async () => {
    mockBuildClaims.mockResolvedValueOnce({ tenantId: 'uuid-tenant-1' });
    const result = await preToken(mockEvent);
    const claims =
      result.response.claimsAndScopeOverrideDetails?.accessTokenGeneration?.claimsToAddOrOverride;
    expect(claims).toEqual({ tenantId: 'uuid-tenant-1' });
  });

  it('sets empty claims when no tenant is found', async () => {
    mockBuildClaims.mockResolvedValueOnce({});
    const result = await preToken(mockEvent);
    const claims =
      result.response.claimsAndScopeOverrideDetails?.accessTokenGeneration?.claimsToAddOrOverride;
    expect(claims).toEqual({});
  });
});
