export interface Label {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string; // admin user ID
  updatedAt: Date;
}

export interface CreateLabelData {
  name: string;
}

export interface UpdateLabelData {
  name?: string;
}
