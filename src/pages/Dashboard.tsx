import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // ajuste o caminho se necessário
import { useAuthContext } from '../context/useAuthContext';
import type { Contract } from '../types/Contract';

// Resumindo
// useAuthContext: use para acessar { user, loading }
// useAuth: use para login/cadastro/logout
// AuthProvider: use para envolver seu app

const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      if (!user) return;
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setContracts(data);
        console.log('Contratos:', data);
      }
      setLoading(false);
    };

    fetchContracts();
  }, [user]);

  // Cálculos dos stats
  const totalContracts = contracts.length;
  const completed = contracts.filter(c => c.status === 'completed').length;
  const pending = contracts.filter(c => c.status === 'pending').length;
  const revenue = contracts.reduce((sum, c) => {
    let value = c.total_value;
    if (typeof value === 'string') {
      // Remove "R$", espaços e tudo que não for número, ponto ou vírgula
      value = value.replace(/[^0-9.,-]/g, '');
      // Remove pontos de milhar (mantém só o decimal)
      value = value.replace(/\./g, '');
      // Troca vírgula por ponto para decimal
      value = value.replace(',', '.');
    }
    const num = Number(value);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const stats = [
    {
      title: 'Contracts Created',
      value: loading ? '...' : totalContracts,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: 'Completed',
      value: loading ? '...' : completed,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: 'Pending',
      value: loading ? '...' : pending,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      color: 'bg-orange-500',
    },
    {
      title: 'Revenue',
      value: loading ? '...' : `$ ${revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your contracts and projects</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start New Project</h2>
            <p className="text-gray-600 mb-6">Create a professional contract in minutes</p>
            <Link
              to="/create-contract"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Contract
            </Link>
          </div>
        </div>

        {/* Recent Contracts */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Contracts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {loading ? (
                <p>Carregando...</p>
              ) : contracts.length === 0 ? (
                <p>Nenhum contrato encontrado.</p>
              ) : (
                contracts.slice(0, 3).map((contract) => (
                  <div
                    key={contract.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-y-2"
                  >
                    {/* Coluna 1: Project Name */}
                    <div className="font-semibold text-gray-900 min-w-[140px]">{contract.project_name}</div>

                    {/* Coluna 2: Client Name e Contract Number */}
                    <div className="flex flex-col sm:ml-4">
                      <span className="text-sm text-gray-700">{contract.client_name}</span>
                      <span className="text-xs text-gray-500">Contrato #{contract.contract_number || contract.id}</span>
                    </div>

                    {/* Coluna 3: Status e Valor */}
                    <div className="flex items-center space-x-2 sm:ml-auto">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contract.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : contract.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contract.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {(() => {
                          let value = contract.total_value;
                          if (typeof value === 'string') {
                            value = value.replace(/[^0-9.,-]/g, '');
                            value = value.replace(/\./g, '');
                            value = value.replace(',', '.');
                          }
                          const num = Number(value);
                          return isNaN(num) ? '-' : num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                        })()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
