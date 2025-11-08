export interface ProbaNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ProbaItem {
  id: string;
  progressId: string;
  text: string;
  isCompleted: boolean;
  completedBy?: {
    id: string;
    name: string;
  };
  completedAt?: string;
  notes?: ProbaNote[];
}

export interface ProbaSection {
  id: string;
  name: string;
  items: ProbaItem[];
}

export interface Proba {
  id: string;
  name: string;
  sections: ProbaSection[];
}
