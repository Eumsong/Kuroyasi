export interface DrawingStroke {
  path: string;
  color: string;
  width: number;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  strokes: DrawingStroke[];
  createdAt: number;
  updatedAt: number;
}
