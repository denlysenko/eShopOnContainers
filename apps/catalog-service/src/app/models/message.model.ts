export interface Message {
  id: string;
  payload: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
