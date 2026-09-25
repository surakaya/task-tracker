import { Task } from "../types/task";
import TaskCard from "./TaskCard";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  title: string;
  tasks: Task[];
  statusColor: string;
  onStatusChange: (
    id: number,
    status: Task["status"]
  ) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({
  title,
  tasks,
  statusColor,
  onStatusChange,
  onDelete,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}
        >
          {title}
        </span>

        <span className="text-xs text-slate-400">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-400">
          Görev yok
        </div>
      ) : (
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <TaskCard
                task={task}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}