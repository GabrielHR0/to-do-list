import React, { useState } from 'react';
import { Plus, List, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { TodoList } from '../types';

interface SidebarProps {
  lists: TodoList[];
  currentListId: string | null; // 🔹 permitir null
  onSelectList: (id: string) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (id: string) => void;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}


export const Sidebar: React.FC<SidebarProps> = ({
  lists,
  currentListId,
  onSelectList,
  onCreateList,
  onDeleteList,
  loading = false,
  error = null,
  onRefresh,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateList();
    else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewListName('');
    }
  };

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">To Do</h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Recarregar listas"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Carregando listas...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-red-600" />
              <p className="text-red-600 text-sm font-medium">Erro ao carregar</p>
            </div>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-red-600 text-sm underline mt-2"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <button
              onClick={() => setIsCreating(true)}
              disabled={isCreating}
              className="w-full flex items-center gap-3 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Plus size={20} />
              <span>Nova Lista</span>
            </button>

            {isCreating && (
              <div className="mt-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={() => {
                    if (!newListName.trim()) setIsCreating(false);
                  }}
                  placeholder="Nome da lista"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Lista de listas */}
      <div className="flex-1 overflow-y-auto">
        {lists.length > 0 ? (
          lists.map((list) => (
            <div
              key={list.id}
              className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                list.id === currentListId
                  ? 'bg-blue-100 border-r-2 border-blue-600'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onSelectList(list.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                <List size={18} className="text-gray-600" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-800 truncate">{list.name}</div>
                  <div className="text-sm text-gray-500">
                    {list.tasks.length} {list.tasks.length === 1 ? 'tarefa' : 'tarefas'}
                  </div>
                </div>
              </div>

              {/* Botão de lixeira sempre visível */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Deletar lista:', list.id); // Para teste
                  onDeleteList(list.id);
                }}
                className="p-1 hover:bg-red-100 rounded transition-all"
                title="Excluir lista"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 px-4">
            <List size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">Nenhuma lista encontrada</p>
            <button
              onClick={() => setIsCreating(true)}
              className="text-blue-600 text-sm hover:text-blue-700 font-medium"
            >
              Criar sua primeira lista
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          {loading ? 'Carregando...' : `${lists.length} lista${lists.length !== 1 ? 's' : ''}`}
        </div>
      </div>
    </div>
  );
};
