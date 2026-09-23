import { Task, TaskStatus } from "../types/task";

const BASE_URL = "http://localhost:4000/api/tasks";

export interface User { id: number; name: string; email: string; }
export interface AuthResult { token: string; user: User; }
export interface TaskInput { title: string; description: string; isImportant: boolean; reminderAt: string | null; roomId?: number | null; }
export interface Room {
  id: number;
  name: string;
  joinCode: string;
  role: string;
  _count: { members: number; tasks: number };
  members: {
    user: {
      id: number;
      name: string;
    };
  }[];
}

function authHeaders(token: string) { return { "Content-Type": "application/json", Authorization: `Bearer ${token}` }; }

async function authRequest(path: string, body: Record<string, string>): Promise<AuthResult> {
  const res = await fetch(`http://localhost:4000/api/auth/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error((await res.json()).error ?? "İşlem gerçekleştirilemedi.");
  return res.json();
}

export function login(email: string, password: string) { return authRequest("login", { email, password }); }
export function register(name: string, email: string, password: string) { return authRequest("register", { name, email, password }); }
export async function logout(token: string) { await fetch("http://localhost:4000/api/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } }); }

export async function fetchTasks(token: string, roomId?: number): Promise<Task[]> {
  const url = roomId ? `${BASE_URL}?roomId=${roomId}` : BASE_URL;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Görevler alınamadı.");
  return res.json();
}

export async function createTask(token: string, task: TaskInput): Promise<Task> {
  const res = await fetch(BASE_URL, { method: "POST", headers: authHeaders(token), body: JSON.stringify(task) });
  if (!res.ok) throw new Error("Görev eklenemedi.");
  return res.json();
}

export async function updateTaskStatus(token: string, id: number, status: TaskStatus): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "PUT", headers: authHeaders(token), body: JSON.stringify({ status }) });
  if (!res.ok) throw new Error("Durum güncellenemedi.");
  return res.json();
}

export async function deleteTask(token: string, id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Görev silinemedi.");
}

export async function fetchRooms(token: string): Promise<Room[]> {
  const res = await fetch("http://localhost:4000/api/rooms", { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Odalar alınamadı.");
  return res.json();
}

export async function createRoom(token: string, name: string): Promise<Room> {
  const res = await fetch("http://localhost:4000/api/rooms", { method: "POST", headers: authHeaders(token), body: JSON.stringify({ name }) });
  if (!res.ok) throw new Error((await res.json()).error ?? "Oda oluşturulamadı.");
  return res.json();
}

export async function joinRoom(token: string, code: string): Promise<Room> {
  const res = await fetch("http://localhost:4000/api/rooms/join", { method: "POST", headers: authHeaders(token), body: JSON.stringify({ code }) });
  if (!res.ok) throw new Error((await res.json()).error ?? "Odaya katılınamadı.");
  return res.json();
}

export async function leaveRoom(token: string, id: number): Promise<void> {
  const res = await fetch(`http://localhost:4000/api/rooms/${id}/leave`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error((await res.json()).error ?? "Odadan ayrılamadınız.");
}
