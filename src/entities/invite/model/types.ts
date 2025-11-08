export enum InviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}

export enum InviteType {
  LIAISON = 'LIAISON',
  FOREMAN = 'FOREMAN',
  SCOUT = 'SCOUT',
  CO_FOREMAN = 'CO_FOREMAN',
}

export interface Invite {
  id: string;
  email: string;
  hash: string;
  groupId: string;
  groupName?: string;
  invitedBy?: string;
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
}

export interface GenerateInviteRequest {
  type: InviteType;
  contextId: string;
}

export interface GenerateInviteResponse {
  token: string;
  inviteLink: string;
  type: InviteType;
  expiresAt: string;
}

export interface AcceptInviteResponse {
  message: string;
  groupId?: string;
  groupName?: string;
  kurinId?: string;
  kurinName?: string;
}

export interface InviteDetailsResponse {
  id: string;
  email: string;
  groupName: string;
  invitedBy: string;
  status: InviteStatus;
  expiresAt: string;
}

export interface JoinGroupResponse {
  message: string;
  groupId: string;
  groupName: string;
}
