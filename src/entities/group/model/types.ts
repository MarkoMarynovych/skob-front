export interface ScoutInGroup {
  id: string;
  name: string;
  email: string;
  picture?: string;
  completedProbasCount: number;
  totalProbasCount: number;
  completedItems?: number;
  totalItems?: number;
}

export interface Group {
  id: string;
  name: string;
  foremanId: string;
  scouts: ScoutInGroup[];
  createdAt: string;
  scoutCount?: number;
  averageProgress?: number;
}

export interface GroupDetails {
  id: string;
  name: string;
  foremanId: string;
  foreman?: {
    id: string;
    name: string;
    email: string;
  };
  scoutCount: number;
  averageProgress: number;
  scouts: ScoutInGroup[];
}

export interface CreateGroupRequest {
  name: string;
}

export interface InviteLinkResponse {
  inviteToken: string;
}
