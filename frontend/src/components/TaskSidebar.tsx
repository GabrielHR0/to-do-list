import React, { useEffect, useState } from "react";
import { X, Plus, CheckCircle, Circle, Trash2 } from "lucide-react";
import { Task } from "../types";

interface Step {
  id: number;
  title: string;
  status: "pending" | "completed";
}

interface TaskSidebarProps {
  task: Task | null;
  onClose: () => void;
}

const API_URL = "http://localhost:3000/task";

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ task, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"pending" | "completed">("pending");
  const [steps, setSteps] = useState<Step[]>([]);
  const [newStep, setNewStep] = useState("");

  // Carrega dados da task
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.dueDate || "");
      setStatus(task.status as "pending" | "completed");
      fetchSteps(task.id);
    }
  }, [task]);

  const fetchSteps = async (taskId: number) => {
    try {
      const res = await fetch(`${API_URL}/fetchSteps/${taskId}`);
      if (res.ok) {
        const data = await res.json();
        setSteps(data);
      }
    } catch (err) {
      console.error("Erro ao carregar steps:", err);
    }
  };

  const handleSave = async () => {
    if (!task) return;
    try {
      const res = await fetch(`${API_URL}/updateTask/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar task");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStep = async () => {
    if (!task || !newStep.trim()) return;
    try {
      const res = await fetch(`${API_URL}/addStep`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newStep, taskId: task.id }),
      });
      window.location.reload()
      if (!res.ok) throw new Error("Erro ao adicionar step");
      setNewStep("");
      fetchSteps(task.id);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStepStatus = async (step: Step) => {
    try {
      const res = await fetch(`${API_URL}/updateStep`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId: step.id,
          title: step.title,
          status: step.status === "pending" ? "completed" : "pending",
        }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar step");
      fetchSteps(task!.id);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStep = async (stepId: number) => {
    try {
      const res = await fetch(`${API_URL}/deleteStep/${stepId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar step");
      fetchSteps(task!.id);
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl border-l p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Editar Task</h2>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Status da Task (somente visualização) */}
      <div className="flex items-center gap-2 mb-4">
        {status === "completed" ? (
          <>
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-green-600 font-medium">Concluída</span>
          </>
        ) : (
          <>
            <Circle size={20} className="text-gray-400" />
            <span className="text-yellow-600 font-medium">Pendente</span>
          </>
        )}
      </div>

      {/* Form da Task (editável) */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        <input
          className="border rounded p-2"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border rounded p-2"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="border rounded p-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* Steps (editáveis) */}
        <div>
          <h3 className="font-semibold mb-2">Steps</h3>
          <div className="flex gap-2 mb-2">
            <input
              className="border rounded p-2 flex-1"
              placeholder="Novo step"
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
              onClick={handleAddStep}
            >
              <Plus size={18} />
            </button>
          </div>
          <ul className="space-y-2">
            {steps.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleStepStatus(s)}>
                    {s.status === "completed" ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <Circle size={18} className="text-gray-400" />
                    )}
                  </button>
                  <span className={s.status === "completed" ? "line-through text-gray-400" : ""}>
                    {s.title}
                  </span>
                </div>
                <button onClick={() => deleteStep(s.id)}>
                  <Trash2 size={16} className="text-red-500 hover:text-red-700" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botão salvar */}
      <button
        onClick={handleSave}
        className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Salvar
      </button>
    </div>
  );
};
