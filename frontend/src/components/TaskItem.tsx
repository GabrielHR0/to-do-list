import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { Task } from '../types';
import { useTodoStore } from '../hooks/useTodoStore';

interface TaskItemProps {
  task: Task;
  onDelete: () => void;
  onClick: () => void;
}

const API_URL = 'http://localhost:3000/task';

export const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onClick }) => {
  const { refreshLists, currentListId } = useTodoStore();
  const [completed, setCompleted] = useState(task.status === 'completed');

  // Função que verifica se a task está completa
  const checkIfCompleted = (t: Task) => t.status === 'completed';

  // Atualiza estado sempre que a task mudar
  useEffect(() => {
    setCompleted(checkIfCompleted(task));
  }, [task]);

  const handleToggleComplete = async () => {
    try {
      const url = `${API_URL}/${completed ? 'open' : 'complete'}/${task.id}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`Erro ao atualizar tarefa: ${res.status}`);

      // Atualiza estado local para resposta imediata
      setCompleted(!completed);

      // Atualiza lista completa do backend
      if (currentListId) await refreshLists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 border rounded-lg ${
        completed ? 'bg-gray-100' : 'bg-white'
      } hover:shadow-md transition`}
    >
      <div className="flex items-center gap-3 cursor-pointer" onClick={onClick}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleComplete();
          }}
        >
          {completed ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <Circle size={20} className="text-gray-400" />
          )}
        </button>
        <span className={`${completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </span>
      </div>
      <button onClick={onDelete}>
        <Trash2 size={18} className="text-red-500 hover:text-red-700" />
      </button>
    </div>
  );
};
