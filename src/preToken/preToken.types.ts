export interface TenantItem {
  tenantId: string;
  tenantName: string;
  tenantDomain: string;
  role: string;
  isActive: boolean;
  pgTenantUserId: string;
}

export interface UserItem {
  id: string;
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  slug: string;
  pgUserId: string;
  updatedAt: string;
  tenants: TenantItem[];
}
