import { Task, TaskStatus } from "../types/task";

interface Props { task: Task; onStatusChange: (id: number, status: TaskStatus) => void; onDelete: (id: number) => void; }
const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [{ value: "pending", label: "Bekliyor" }, { value: "in_progress", label: "Devam Ediyor" }, { value: "done", label: "Tamamlandı" }];

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  return <div className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3 ${task.isImportant ? "border-brand-200 ring-1 ring-brand-100" : "border-slate-200"}`}><div><div className="flex items-start gap-2"><p className="text-sm font-medium text-slate-800 leading-snug">{task.title}</p>{task.isImportant && <span className="text-[10px] rounded-full bg-brand-50 text-brand-700 px-2 py-0.5">Önemli</span>}</div>{task.description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.description}</p>}{task.reminderAt && <p className="mt-2 text-[11px] text-brand-700">◷ {new Date(task.reminderAt).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}</p>}{task.roomId && task.user && (
    <p className="text-[11px] text-slate-400">
      {task.user.name} tarafından eklendi
    </p>
  )}</div><div className="flex items-center justify-between gap-2"><select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)} className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-600 cursor-pointer">{STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><button onClick={() => onDelete(task.id)} className="text-xs text-red-400 hover:text-red-600 transition px-2 py-1 rounded-lg hover:bg-red-50">Sil</button></div><p className="text-[10px] text-slate-300">{new Date(task.createdAt).toLocaleDateString("tr-TR")}</p></div>;
}
