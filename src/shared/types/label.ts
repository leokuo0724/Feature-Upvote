export interface Label {
  id: string;
  name: string;
  backgroundColor: string; // hex color
  textColor: string; // hex color
  createdAt: Date;
  createdBy: string; // admin user ID
  updatedAt: Date;
}

export interface CreateLabelData {
  name: string;
  backgroundColor: string;
  textColor: string;
}

export interface UpdateLabelData {
  name?: string;
  backgroundColor?: string;
  textColor?: string;
}
