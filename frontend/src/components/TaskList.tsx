import React, { useState } from 'react';
import { Plus, Calendar, Edit2, Check, X, List } from 'lucide-react';
import { TodoList, Task } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  list: TodoList;
  onUpdateListName: (name: string) => void;
  onAddTask: (title: string, dueDate?: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onTaskClick: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  list,
  onUpdateListName,
  onAddTask,
  onDeleteTask,
  onToggleComplete,
  onTaskClick,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.name);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleTitleSave = () => {
    if (editedTitle.trim()) onUpdateListName(editedTitle.trim());
    else setEditedTitle(list.name);
    setIsEditingTitle(false);
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), newTaskDueDate || undefined);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setShowDatePicker(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('pt-BR');
  };

  const completedTasks = list.tasks.filter((task) => task.completed);
  const pendingTasks = list.tasks.filter((task) => !task.completed);

  return (
    <div className="flex-1 bg-white">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') {
                    setEditedTitle(list.name);
                    setIsEditingTitle(false);
                  }
                }}
                onBlur={handleTitleSave}
                className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-500 focus:outline-none flex-1"
                autoFocus
              />
              <button onClick={handleTitleSave} className="p-1 hover:bg-green-100 rounded">
                <Check size={18} className="text-green-600" />
              </button>
              <button
                onClick={() => {
                  setEditedTitle(list.name);
                  setIsEditingTitle(false);
                }}
                className="p-1 hover:bg-red-100 rounded"
              >
                <X size={18} className="text-red-600" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-1 group">
              <h1 className="text-2xl font-bold text-gray-800">{list.name}</h1>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
              >
                <Edit2 size={18} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {list.tasks.length} {list.tasks.length === 1 ? 'tarefa' : 'tarefas'} •{' '}
          {completedTasks.length} concluída{completedTasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Plus size={20} className="text-blue-600" />
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Adicionar uma tarefa"
              className="flex-1 text-lg focus:outline-none"
            />
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  newTaskDueDate
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-md'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 hover:shadow-md'
                }`}
                title={
                  newTaskDueDate
                    ? `Vencimento: ${formatDate(newTaskDueDate)}`
                    : 'Adicionar data de vencimento'
                }
              >
                <Calendar size={16} />
              </button>
              {showDatePicker && (
                <div className="absolute right-0 top-10 z-10">
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
          {newTaskTitle.trim() && (
            <div className="flex justify-end">
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          )}
        </div>

        {pendingTasks.length > 0 && (
          <div className="mb-6">
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={() => onToggleComplete(task)}
                  onDelete={() => onDeleteTask(task.id)}
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Concluídas ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={() => onToggleComplete(task)}
                  onDelete={() => onDeleteTask(task.id)}
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </div>
          </div>
        )}

        {list.tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <List size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500">Nenhuma tarefa ainda. Adicione uma acima!</p>
          </div>
        )}
      </div>
    </div>
  );
};
