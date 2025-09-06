import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { TaskSidebar } from './components/TaskSidebar';
import { useTodoStore } from './hooks/useTodoStore';
import { Task } from './types';
import { User } from 'lucide-react';

function App() {
  const {
    lists,
    currentList,
    currentListId,
    setCurrentListId,
    loading,
    error,
    createList,
    updateListName,
    deleteList,
    addTask,
    updateTask,
    deleteTask,
    addStep,
    updateStep,
    deleteStep,
    refreshLists,
    fetchTasks,
    completeTask,
    reopenTask,
    fetchSteps,
    login,
    register,
    logout,
    isLoggedIn,
  } = useTodoStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskVersion, setTaskVersion] = useState(0);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ---------------- HANDLERS ----------------
  const handleTaskClick = (task: Task) => setSelectedTask(task);
  const handleCloseSidebar = () => setSelectedTask(null);

  // ---------------- AUTENTICAÇÃO ----------------
  const handleLogin = async () => {
    try {
      setAuthError(null);
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao logar');
    }
  };

  const handleRegister = async () => {
    try {
      setAuthError(null);
      await register(email, password);
      setAuthMode('login');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao registrar');
    }
  };

  // ---------------- LÓGICA DE TASKS E LISTAS ----------------
  useEffect(() => {
    if (currentListId) fetchTasks(currentListId);
  }, [currentListId]);

  useEffect(() => {
    if (selectedTask && currentList) {
      const updatedTask = currentList.tasks.find(t => t.id === selectedTask.id);
      setSelectedTask(updatedTask ?? null);
      setTaskVersion(prev => prev + 1);
    }
  }, [currentList?.tasks, selectedTask?.id]);

  // ---------------- FUNÇÕES CRUD ----------------
  const handleCreateList = async (name: string) => {
    try {
      await createList(name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await deleteList(listId);
      if (selectedTask && currentListId === listId) setSelectedTask(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateListName = async (name: string) => {
    if (!currentListId) return;
    try {
      await updateListName(currentListId, name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async (title: string, dueDate?: string) => {
    try {
      await addTask(title, dueDate);
      if (currentListId) await fetchTasks(currentListId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      if (selectedTask?.id === taskId) setSelectedTask(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!currentList) return;
    try {
      const allStepsCompleted = task.steps?.every(s => s.status === 'completed') ?? false;

      if (task.completed || allStepsCompleted) {
        await reopenTask(task.id);
      } else {
        await completeTask(task.id);
      }

      await refreshLists();
      const updatedTask = currentList.tasks.find(t => t.id === task.id);
      setSelectedTask(updatedTask ?? null);
      setTaskVersion(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddStep = async (taskId: string, stepTitle: string) => {
    try {
      await addStep(taskId, stepTitle);
      if (currentListId) await fetchTasks(currentListId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStep = async (stepId: string, title: string, status: string) => {
    try {
      await updateStep(stepId, title, status);
      if (currentListId) await fetchTasks(currentListId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteStep = async (taskId: string, stepId: string) => {
    try {
      await deleteStep(taskId, stepId);
      if (currentListId) await fetchTasks(currentListId);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- RENDER ----------------
  if (!isLoggedIn()) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {authMode === 'login' ? 'Login' : 'Registrar'}
          </h2>
          {authError && <p className="text-red-500 mb-2">{authError}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 mb-3 border rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white py-2 rounded mb-2"
            onClick={authMode === 'login' ? handleLogin : handleRegister}
          >
            {authMode === 'login' ? 'Entrar' : 'Registrar'}
          </button>
          <p className="text-sm text-center text-gray-500">
            {authMode === 'login' ? (
              <>
                Não tem conta?{' '}
                <button className="text-blue-500 underline" onClick={() => setAuthMode('register')}>
                  Registrar
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button className="text-blue-500 underline" onClick={() => setAuthMode('login')}>
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100 relative">
      <Sidebar
        lists={lists}
        currentListId={currentListId}
        onSelectList={setCurrentListId}
        onCreateList={handleCreateList}
        onDeleteList={handleDeleteList}
        loading={loading}
        error={error}
        onRefresh={refreshLists}
      />

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex justify-end items-center p-2 bg-white border-b border-gray-200 relative">
          <button
            onClick={() => setShowUserMenu(prev => !prev)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Usuário"
          >
            <User size={20} />
          </button>
          {showUserMenu && (
            <div className="absolute right-2 top-10 w-48 bg-white border rounded-lg shadow-lg z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  logout();
                  setSelectedTask(null);
                  setCurrentListId('');
                  setAuthMode('login');
                  setShowUserMenu(false);
                }}
              >
                Entrar com outra conta
              </button>
            </div>
          )}
        </div>

        {currentList ? (
          <TaskList
            list={currentList}
            onUpdateListName={handleUpdateListName}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onTaskClick={handleTaskClick}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              {lists.length === 0
                ? 'Crie sua primeira lista na sidebar'
                : 'Escolha uma lista na sidebar'}
            </div>
          </div>
        )}

        {/* Sidebar de Task */}
        {selectedTask && (
          <TaskSidebar
            key={`${selectedTask.id}-${taskVersion}`}
            task={{ ...selectedTask, steps: selectedTask.steps ?? [] }}
            isOpen={true}
            onClose={handleCloseSidebar}
            onUpdate={updateTask}
            onDelete={handleDeleteTask}
            onAddStep={handleAddStep}
            onUpdateStep={handleUpdateStep}
            onDeleteStep={handleDeleteStep}
            fetchSteps={fetchSteps}
          />
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Carregando...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
