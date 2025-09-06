import { useState, useEffect } from 'react';
import { TodoList, Task, Step } from '../types';

const API_URL = 'http://localhost:3000';

export const useTodoStore = () => {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [currentList, setCurrentList] = useState<TodoList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // ---------------- AUTENTICAÇÃO ----------------
  const register = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(`Erro ao registrar: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(`Erro ao logar: ${res.status}`);
      const data = await res.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setLists([]);
    setCurrentList(null);
    setCurrentListId(null);
  };

  const isLoggedIn = () => !!token;

  // ---------------- FUNÇÕES DE LISTAS ----------------
  const loadLists = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      // Buscar usuário logado a partir do token (JWT decodificado)
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const userId = payload?.id;
      if (!userId) throw new Error('Usuário não identificado');

      const res = await fetch(`${API_URL}/list/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erro ao carregar listas: ${res.status}`);

      const data: TodoList[] = await res.json();
      const listsWithTasks = data.map(list => ({
        ...list,
        name: list.name || list.title || 'Nova Lista',
        tasks: Array.isArray(list.tasks)
          ? list.tasks.map(task => ({ ...task, steps: Array.isArray(task.steps) ? task.steps : [] }))
          : [],
      }));

      setLists(prev =>
        listsWithTasks.map(list => {
          const existing = prev.find(l => l.id === list.id);
          return existing ? { ...list, tasks: existing.tasks } : list;
        })
      );

      if (!currentListId && listsWithTasks.length > 0) setCurrentListId(listsWithTasks[0].id);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Chama loadLists sempre que o token mudar
  useEffect(() => {
    if (token) loadLists();
  }, [token]);

  useEffect(() => {
    const list = lists.find(l => l.id === currentListId) || null;
    setCurrentList(list);
  }, [currentListId, lists]);

  const createList = async (name: string) => {
    if (!token) return;
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/list/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: name, userId }),
      });

      if (!res.ok) throw new Error(`Erro ao criar lista: ${res.status}`);
      const newList = await res.json();

      await loadLists(); 
      setCurrentListId(newList.id);
    } catch (error) {
      console.error(error);
    }
  };

  // Função auxiliar para extrair userId do token JWT
  const getUserIdFromToken = (): string | null => {
    if (!token) return null;
    try {
      // O token JWT tem três partes separadas por ".", a segunda é o payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.id || null;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };

  const updateListName = async (listId: string, name: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/list/rename`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskListId: listId, title: name }),
      });
      if (!res.ok) throw new Error(`Erro ao atualizar lista: ${res.status}`);
      setLists(prev => prev.map(list => (list.id === listId ? { ...list, name } : list)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteList = async (listId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/list/delete/${listId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erro ao deletar lista: ${res.status}`);
      setLists(prev => prev.filter(list => list.id !== listId));
      if (currentListId === listId) setCurrentListId(lists.length > 1 ? lists[0].id : null);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- FUNÇÕES DE TASKS ----------------
  const fetchTasks = async (taskListId: string) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/list/fetch/${taskListId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erro ao buscar tarefas: ${res.status}`);
      const tasks: Task[] = await res.json();
      setLists(prev =>
        prev.map(list =>
          list.id === taskListId
            ? { ...list, tasks: tasks.map(task => ({ ...task, steps: task.steps || [] })) }
            : list
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string, dueDate?: string) => {
    if (!currentListId || !token) return;
    try {
      const res = await fetch(`${API_URL}/list/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskListId: currentListId, title, dueDate }),
      });
      if (!res.ok) throw new Error(`Erro ao adicionar tarefa: ${res.status}`);
      const task: Task = await res.json();
      setLists(prev =>
        prev.map(list =>
          list.id === currentListId
            ? { ...list, tasks: [...(list.tasks || []), { ...task, steps: task.steps || [] }] }
            : list
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!currentListId || !token) return;
    try {
      await fetch(`${API_URL}/task/updateTask`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId, taskListId: currentListId, ...updates }),
      });
      setLists(prev =>
        prev.map(list =>
          list.id === currentListId
            ? {
                ...list,
                tasks: (list.tasks || []).map(task =>
                  task.id === taskId ? { ...task, ...updates } : task
                ),
              }
            : list
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!currentListId || !token) return;
    try {
      await fetch(`${API_URL}/list/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskListId: currentListId, taskId }),
      });
      setLists(prev =>
        prev.map(list =>
          list.id === currentListId
            ? { ...list, tasks: (list.tasks || []).filter(task => task.id !== taskId) }
            : list
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- FUNÇÕES DE TASKS ----------------
  const completeTask = async (taskId: string) => {
    if (!currentListId || !token) return;
    try {
      await fetch(`${API_URL}/task/finish/${taskId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      setLists(prev =>
        prev.map(list =>
          list.id === currentListId
            ? {
                ...list,
                tasks: (list.tasks || []).map(task =>
                  task.id === taskId ? { ...task, completed: true, status: 'completed', endDate: new Date().toLocaleDateString('pt-BR') } : task
                ),
              }
            : list
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const reopenTask = async (taskId: string) => {
    if (!currentListId || !token) return;
    try {
      await fetch(`${API_URL}/task/reOpen/${taskId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      setLists(prev =>
        prev.map(list =>
          list.id === currentListId
            ? {
                ...list,
                tasks: (list.tasks || []).map(task =>
                  task.id === taskId ? { ...task, completed: false, status: 'pending', endDate: null } : task
                ),
              }
            : list
        )
      );
    } catch (error) {
      console.error(error);
    }
  };


  // ---------------- FUNÇÕES DE STEPS ----------------
  const addStep = async (taskId: string, stepTitle: string) => {
    if (!currentListId || !token) return;
    try {
      const res = await fetch(`${API_URL}/task/addStep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: stepTitle, taskId }),
      });
      if (!res.ok) throw new Error(`Erro ao adicionar passo: ${res.status}`);
      const step: Step = await res.json();
      setLists(prev =>
        prev.map(list =>
          list.id === currentListId
            ? {
                ...list,
                tasks: (list.tasks || []).map(task =>
                  task.id === taskId
                    ? { ...task, steps: [...(task.steps || []), step], stepsUpdated: Date.now() }
                    : task
                ),
              }
            : list
        )
      );
      return step;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateStep = async (stepId: string, title: string, status: string) => {
    if (!currentListId || !token) return;
    try {
      await fetch(`${API_URL}/task/updateStep`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stepId, title, status }),
      });
      setLists(prev =>
        prev.map(list =>
          list.id === currentListId
            ? {
                ...list,
                tasks: (list.tasks || []).map(task => {
                  const stepIndex = task.steps?.findIndex(step => step.id === stepId);
                  if (stepIndex !== undefined && stepIndex !== -1) {
                    return {
                      ...task,
                      steps: task.steps?.map(step =>
                        step.id === stepId ? { ...step, title, status } : step
                      ),
                      stepsUpdated: Date.now(),
                    };
                  }
                  return task;
                }),
              }
            : list
        )
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteStep = async (taskId: string, stepId: string) => {
    if (!currentListId || !token) return;
    try {
      await fetch(`${API_URL}/task/deleteStep/${stepId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(prev =>
        prev.map(list =>
          list.id === currentListId
            ? {
                ...list,
                tasks: (list.tasks || []).map(task =>
                  task.id === taskId
                    ? { ...task, steps: (task.steps || []).filter(step => step.id !== stepId), stepsUpdated: Date.now() }
                    : task
                ),
              }
            : list
        )
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const fetchSteps = async (taskId: string): Promise<Step[]> => {
    if (!token) return [];
    try {
      const res = await fetch(`${API_URL}/task/fetchSteps/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erro ao buscar passos: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return {
    lists,
    currentList,
    currentListId,
    setCurrentListId,
    loading,
    error,
    token,
    isLoggedIn,
    login,
    logout,
    register,
    refreshLists: loadLists,
    fetchTasks,
    createList,
    updateListName,
    deleteList,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    reopenTask,
    addStep,
    updateStep,
    deleteStep,
    fetchSteps,
  };
};


