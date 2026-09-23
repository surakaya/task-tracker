export type TaskStatus = "pending" | "in_progress" | "done";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  isImportant: boolean;
  reminderAt: string | null;
  roomId: number | null;
  user?: {
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
