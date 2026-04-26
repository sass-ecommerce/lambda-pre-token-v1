
import { buildClaims } from '../../src/preToken/preToken.service';
import { UserItem } from '../../src/preToken/preToken.types';

const mockUser: UserItem = {
  PK: 'USER#test-sub',
  email: 'dueno@mitiendita.pe',
  firstName: 'Carlos',
  lastName: 'Mendoza',
  isActive: true,
  slug: 'uuid-v4',
  pgUserId: 'uuid-postgres',
  updatedAt: '2026-04-26T10:00:00Z',
  tenants: [
    {
      tenantId: 'uuid-tenant-1',
      tenantName: 'Comercial SJL',
      tenantDomain: 'comercialsjl.mitiendita.com',
      role: 'ADMINISTRADOR',
      isActive: true,
      pgTenantUserId: 'uuid-tenant-user',
    },
    {
      tenantId: 'uuid-tenant-2',
      tenantName: 'Tienda Norte',
      tenantDomain: 'tiendanorte.mitiendita.com',
      role: 'AYUDANTE',
      isActive: true,
      pgTenantUserId: 'uuid-tenant-user-2',
    },
  ],
};

const mockSend = jest.fn();
const mockDocClient = { send: mockSend } as any;

describe('buildClaims', () => {
  beforeEach(() => mockSend.mockReset());

  it('returns tenantId from the first tenant', async () => {
    mockSend.mockResolvedValueOnce({ Item: mockUser });
    const claims = await buildClaims('test-sub', mockDocClient);
    expect(claims).toEqual({ tenantId: 'uuid-tenant-1' });
  });

  it('returns empty claims when user is not found', async () => {
    mockSend.mockResolvedValueOnce({ Item: undefined });
    const claims = await buildClaims('unknown-sub', mockDocClient);
    expect(claims).toEqual({});
  });

  it('returns empty claims when tenants array is empty', async () => {
    mockSend.mockResolvedValueOnce({ Item: { ...mockUser, tenants: [] } });
    const claims = await buildClaims('test-sub', mockDocClient);
    expect(claims).toEqual({});
  });

  it('queries DynamoDB with USER#<sub> as PK', async () => {
    mockSend.mockResolvedValueOnce({ Item: mockUser });
    await buildClaims('abc-123', mockDocClient);
    const commandInput = mockSend.mock.calls[0][0].input;
    expect(commandInput.Key).toEqual({ PK: 'USER#abc-123' });
  });
});
