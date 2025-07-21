import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuthContext } from '../context/useAuthContext';

// https://pdf.co/ >>> api para gerar pdf

const sectionBox = "mb-8";
const sectionTitle = "text-lg font-bold text-blue-700 mb-4";

const initialFormData = {
  project_name: '',
  client_name: '',
  client_cpf: '',
  client_email: '',
  client_address: '',
  provider_name: '',
  provider_cpf: '',
  provider_email: '',
  provider_address: '',
  graphic_design: false,
  web_design: false,
  branding: false,
  social_media: false,
  photography: false,
  illustration: false,
  web_development: false,
  copywriting: false,
  marketing: false,
  others: '',
  service_scope: '',
  start_date: '',
  delivery_date: '',
  total_value: '',
  payment_method: '',
  revision_count: '',
  court_city: '',
  contract_date: new Date().toISOString().split('T')[0],
  status: 'pending', // valor padrão
  logo_url: '',
};

const CreateContract: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [formData, setFormData] = useState(initialFormData);
  const [contractNumber, setContractNumber] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Buscar contrato para edição
      supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) {
            setFormData(data);
            setContractNumber(data.contract_number); // se quiser mostrar o número
          }
        });
    } else {
      // Limpar formulário ao criar novo contrato
      setFormData(initialFormData);
      // Gere novo número de contrato, se necessário
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      setContractNumber(`CON-${year}-${random}`);
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in.');
      return;
    }

    if (id) {
      // UPDATE
      const { error } = await supabase
        .from('contracts')
        .update(formData)
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) {
        alert('Error updating contract: ' + error.message);
      } else {
        alert('Contract updated successfully!');
        navigate('/list-contracts');
      }
    } else {
      // INSERT
      const contractData = {
        ...formData,
        contract_number: contractNumber,
        user_id: user.id,
      };
      const { error } = await supabase.from('contracts').insert([contractData]);
      if (error) {
        alert('Error saving contract: ' + error.message);
      } else {
        alert('Contract saved successfully!');
        navigate('/list-contracts');
      }
    }
  };

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Project Name e Contract Number no topo */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {id ? 'Update Contract' : 'Create Contract'}
          </h1>
          <input
            type="text"
            id="project_name"
            name="project_name"
            value={formData.project_name}
            onChange={e => setFormData({ ...formData, project_name: e.target.value })}
            required
            className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xl font-semibold mb-2"
            placeholder="Project Name (e.g. Website Redesign)"
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            {/* Contract Number à esquerda */}
            {contractNumber && (
              <div className="text-blue-600 font-mono text-sm">
                Contract Number: <span className="font-bold">{contractNumber}</span>
              </div>
            )}
            {/* Status à direita */}
            <div className="flex items-center">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mr-2 mb-0">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <p className="text-gray-600">Fill in the details to generate a professional contract</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Client Details */}
          <div className={sectionBox}>
            <h3 className={sectionTitle}>Client Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Client's full name"
                />
              </div>
              <div>
                <label htmlFor="client_cpf" className="block text-sm font-medium text-gray-700 mb-2">
                  Client CPF/CNPJ *
                </label>
                <input
                  type="text"
                  id="client_cpf"
                  name="client_cpf"
                  value={formData.client_cpf}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="client_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Email
                </label>
                <input
                  type="text"
                  id="client_email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Client email"
                />
                </div>
              <div>
                <label htmlFor="client_address" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Address
                </label>
                <input
                  type="text"
                  id="client_address"
                  name="client_address"
                  value={formData.client_address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Client's full address"
                />
              </div>
           </div>
          </div>

          {/* My Details */}
          <div className={sectionBox}>
            <h3 className={sectionTitle}>My Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="provider_name" className="block text-sm font-medium text-gray-700 mb-2">
                  My Name *
                </label>
                <input
                  type="text"
                  id="provider_name"
                  name="provider_name"
                  value={formData.provider_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="provider_cpf" className="block text-sm font-medium text-gray-700 mb-2">
                  My CPF/CNPJ *
                </label>
                <input
                  type="text"
                  id="provider_cpf"
                  name="provider_cpf"
                  value={formData.provider_cpf}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="provider_email" className="block text-sm font-medium text-gray-700 mb-2">
                  My Email
                </label>
                <input
                  type="text"
                  id="provider_email"
                  name="provider_email"
                  value={formData.provider_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label htmlFor="provider_address" className="block text-sm font-medium text-gray-700 mb-2">
                  My Address
                </label>
                <input
                  type="text"
                  id="provider_address"
                  name="provider_address"
                  value={formData.provider_address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your full address"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className={sectionBox}>
            <h3 className={sectionTitle}>Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { name: 'graphic_design', label: 'Graphic Design' },
                { name: 'web_design', label: 'Web Design' },
                { name: 'branding', label: 'Branding / Logo' },
                { name: 'social_media', label: 'Social Media' },
                { name: 'photography', label: 'Photography' },
                { name: 'illustration', label: 'Illustration' },
                { name: 'web_development', label: 'Web Development' },
                { name: 'copywriting', label: 'Copywriting' },
                { name: 'marketing', label: 'Marketing' },
              ].map((service) => (
                <div key={service.name} className="flex items-center">
                  <input
                    type="checkbox"
                    id={service.name}
                    name={service.name}
                    checked={formData[service.name as keyof typeof formData] as boolean}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={service.name} className="ml-2 block text-sm text-gray-900">
                    {service.label}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="others" className="block text-sm font-medium text-gray-700 mb-2">
                Other Services
              </label>
              <input
                type="text"
                id="others"
                name="others"
                value={formData.others}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Specify other services..."
              />
            </div>
          </div>

          {/* Project Details */}
          <div className={sectionBox}>
            <h3 className={sectionTitle}>Project Details</h3>
            <div>
              <label htmlFor="service_scope" className="block text-sm font-medium text-gray-700 mb-2">
                Service Scope *
              </label>
              <textarea
                id="service_scope"
                name="service_scope"
                value={formData.service_scope}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe the scope of work in detail..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="delivery_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date *
                </label>
                <input
                  type="date"
                  id="delivery_date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label htmlFor="revision_count" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Revisions
                </label>
                <input
                  type="text"
                  id="revision_count"
                  name="revision_count"
                  value={formData.revision_count}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g. 2 revisions included"
                />
              </div>
              <div>
                <label htmlFor="court_city" className="block text-sm font-medium text-gray-700 mb-2">
                  Court City
                </label>
                <input
                  type="text"
                  id="court_city"
                  name="court_city"
                  value={formData.court_city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g. New York, NY"
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className={sectionBox}>
            <h3 className={sectionTitle}>Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="total_value" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Value *
                </label>
                <input
                  type="text"
                  id="total_value"
                  name="total_value"
                  value={formData.total_value}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="$ 3,800.00"
                />
              </div>
              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <input
                  type="text"
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g. 50% upfront, 50% on delivery"
                />
              </div>
            </div>
          </div>

          {/* Logo URL */}
          <div className="mb-6">
            <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL (optional)
            </label>
            <input
              type="text"
              id="logo_url"
              name="logo_url"
              value={formData.logo_url || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="https://yourdomain.com/logo.png"
            />
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {id ? 'Update Contract' : 'Create Contract'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/list-contracts')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContract;
