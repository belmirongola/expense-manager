import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit3, Check, X, RotateCcw, Circle, CheckCircle } from 'lucide-react';

const ExpenseManager = () => {
  // Dados padrão para reset
  const defaultExpenses = [
    { id: 1, name: 'Anacleto', amount: 5000, paid: false },
    { id: 2, name: 'Alex', amount: 45000, paid: false },
    { id: 3, name: 'Credo', amount: 3000, paid: false },
    { id: 4, name: 'Isa', amount: 3000, paid: false },
    { id: 5, name: 'Rosalina', amount: 6000, paid: false },
    { id: 6, name: 'Dedi', amount: 20000, paid: false },
    { id: 7, name: 'Feli', amount: 10000, paid: false },
    { id: 8, name: 'Dízimo', amount: 11000, paid: false },
    { id: 9, name: 'Anéis de namoro', amount: 3000, paid: false },
    { id: 10, name: 'Kit de skin care', amount: 10000, paid: false },
    { id: 11, name: 'Dívida da calça', amount: 3500, paid: false },
    { id: 12, name: 'Pomada do cabelo', amount: 3500, paid: false },
    { id: 13, name: 'Ginásio', amount: 7000, paid: false },
    { id: 14, name: 'Kinha', amount: 10000, paid: false },
    { id: 15, name: 'Herculano', amount: 2000, paid: false },
    { id: 16, name: 'Crédito BAI', amount: 2400, paid: false },
    { id: 17, name: 'Saldo de Dados', amount: 2000, paid: false },
    { id: 18, name: 'Saldo de Voz', amount: 1000, paid: false },
    { id: 19, name: 'Orquidea', amount: 5000, paid: false }
  ];

  const [totalReceived, setTotalReceived] = useState(215000);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', amount: '' });

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedData = localStorage.getItem('expense-manager-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTotalReceived(parsedData.totalReceived || 215000);
        setExpenses(parsedData.expenses || defaultExpenses);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    const dataToSave = {
      totalReceived,
      expenses,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('expense-manager-data', JSON.stringify(dataToSave));
  }, [totalReceived, expenses]);

  // Função para resetar dados
  const resetData = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      setTotalReceived(215000);
      setExpenses([...defaultExpenses]);
      localStorage.removeItem('expense-manager-data');
    }
  };

  // Função para atualizar com a lista mais recente
  const updateToLatestExpenses = () => {
    if (window.confirm('Deseja atualizar para a lista mais recente de despesas? Isso substituirá sua lista atual.')) {
      setExpenses([...defaultExpenses]);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(expense => expense.paid).reduce((sum, expense) => sum + expense.amount, 0);
  const remainingExpenses = totalExpenses - paidExpenses;
  const remainingBalance = totalReceived - paidExpenses;

  const formatCurrency = (amount) => {
    return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  };

  const togglePaid = (id) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, paid: !expense.paid } : expense
    ));
  };

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      const expense = {
        id: Date.now(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount) * 1000,
        paid: false
      };
      setExpenses([...expenses, expense]);
      setNewExpense({ name: '', amount: '' });
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({ 
      name: expense.name, 
      amount: (expense.amount / 1000).toString() 
    });
  };

  const saveEdit = () => {
    if (editForm.name && editForm.amount) {
      setExpenses(expenses.map(expense => 
        expense.id === editingId 
          ? { ...expense, name: editForm.name, amount: parseFloat(editForm.amount) * 1000 }
          : expense
      ));
      setEditingId(null);
      setEditForm({ name: '', amount: '' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', amount: '' });
  };

  const progressPercentage = totalExpenses > 0 ? (paidExpenses / totalExpenses) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-5xl font-light text-gray-900 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Despesas
            </h1>
            <p className="text-lg text-gray-500 font-light">Simplicidade é a sofisticação suprema</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={updateToLatestExpenses}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Atualizar
            </button>
            <button
              onClick={resetData}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500 mb-2 font-medium tracking-wide">RECEBIDO</p>
            <div className="flex items-center justify-center">
              <input
                type="number"
                value={totalReceived / 1000}
                onChange={(e) => setTotalReceived(parseFloat(e.target.value) * 1000 || 0)}
                className="text-3xl font-light text-gray-900 bg-transparent border-none outline-none text-center w-24"
              />
              <span className="text-3xl font-light text-gray-900">k</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500 mb-2 font-medium tracking-wide">DESPESAS</p>
            <p className="text-3xl font-light text-gray-900">{formatCurrency(totalExpenses)}</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500 mb-2 font-medium tracking-wide">PAGO</p>
            <p className="text-3xl font-light text-gray-900">{formatCurrency(paidExpenses)}</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500 mb-2 font-medium tracking-wide">SALDO</p>
            <p className={`text-3xl font-light ${remainingBalance >= 0 ? 'text-gray-900' : 'text-red-500'}`}>
              {formatCurrency(remainingBalance)}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-light text-gray-900">Progresso</h3>
            <span className="text-2xl font-light text-gray-900">{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Add Expense */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-16">
          <h3 className="text-xl font-light text-gray-900 mb-8">Nova Despesa</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 transition-colors duration-200"
            />
            <div className="flex">
              <input
                type="number"
                placeholder="Valor"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="w-32 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-gray-500 transition-colors duration-200"
              />
              <div className="px-4 py-3 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                k
              </div>
            </div>
            <button
              onClick={addExpense}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-xl font-light text-gray-900">Lista de Despesas</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {expenses.map((expense) => (
              <div key={expense.id} className="px-8 py-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => togglePaid(expense.id)}
                      className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
                    >
                      {expense.paid ? (
                        <CheckCircle size={24} className="text-gray-900" />
                      ) : (
                        <Circle size={24} />
                      )}
                    </button>
                    
                    {editingId === expense.id ? (
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                        />
                        <div className="flex">
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-gray-500"
                          />
                          <div className="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 text-sm">
                            k
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-6">
                        <div>
                          <p className={`text-lg font-medium ${expense.paid ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {expense.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-light ${expense.paid ? 'text-gray-400' : 'text-gray-900'}`}>
                            {formatCurrency(expense.amount)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {editingId === expense.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="p-2 text-gray-400 hover:text-gray-900 transition-colors duration-200"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-400 hover:text-gray-900 transition-colors duration-200"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(expense)}
                          className="p-2 text-gray-400 hover:text-gray-900 transition-colors duration-200"
                        >
                          <Edit3 size={20} />
                        </button>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="p-2 text-gray-400 hover:text-gray-900 transition-colors duration-200"
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="grid grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2 font-medium tracking-wide">RESTANTE</p>
            <p className="text-2xl font-light text-gray-900">{formatCurrency(remainingExpenses)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2 font-medium tracking-wide">TOTAL</p>
            <p className="text-2xl font-light text-gray-900">{expenses.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2 font-medium tracking-wide">CONCLUÍDO</p>
            <p className="text-2xl font-light text-gray-900">{expenses.filter(e => e.paid).length}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-400">Auto-save ativo</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManager;