import { Task } from "../types/task";
import TaskCard from "./TaskCard";

interface Props { title: string; tasks: Task[]; statusColor: string; onStatusChange: (id: number, status: Task["status"]) => void; onDelete: (id: number) => void; }

export default function TaskList({ title, tasks, statusColor, onStatusChange, onDelete }: Props) {
  return <div className="flex flex-col gap-3"><div className="flex items-center gap-2"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>{title}</span><span className="text-xs text-slate-400">{tasks.length}</span></div>{tasks.length === 0 ? <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-400">Görev yok</div> : tasks.map((task) => <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} />)}</div>;
}
