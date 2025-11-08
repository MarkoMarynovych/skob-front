export interface Kurin {
  id: string;
  name: string;
  liaisonId?: string;
  liaison?: {
    id: string;
    name: string;
    email: string;
  };
  foremanCount?: number;
  groupCount?: number;
  scoutCount?: number;
  foremenCount?: number;
  scoutsCount?: number;
  createdAt?: string;
}

export interface CreateKurinRequest {
  name: string;
  liaisonId?: string;
}

export interface UpdateKurinRequest {
  name?: string;
  liaisonId?: string;
}

export interface KurinForeman {
  id: string;
  name: string;
  email: string;
  picture?: string;
  groupCount: number;
  scoutCount: number;
  averageProgress?: number;
  groupsCount?: number;
  scoutsCount?: number;
}

export interface KurinDetails {
  id: string;
  name: string;
  liaisonId?: string;
  liaison?: {
    id: string;
    name: string;
    email: string;
  };
  foremanCount: number;
  groupCount: number;
  scoutCount: number;
  foremen: KurinForeman[];
}
