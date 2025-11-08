export enum UserRole {
  SCOUT = 'SCOUT',
  FOREMAN = 'FOREMAN',
  LIAISON = 'LIAISON',
  ADMIN = 'ADMIN',
}

export interface Kurin {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  groupId?: string;
  kurin?: Kurin;
  sex?: string;
}
