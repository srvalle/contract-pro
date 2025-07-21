import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import type { Contract } from '../types/Contract';
import RendererPdfCreate from '../components/RendererPdfCreate';
import { PDFViewer } from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import { contractTexts } from '../utils/contractTexts';

const ViewContract: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'pt'>('en');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setContract(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-blue-600 font-semibold">
          Loading contract...
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-red-600 font-semibold">
          Contract not found.
        </div>
      </div>
    );
  }

  // Função para fechar o modal
  const handleClose = () => {
    // navigate(-1);
    navigate('/list-contracts'); // ou a rota que você quiser voltar
  };
  

  // Função para gerar e enviar o PDF para o n8n
  const sendContractToN8N = async () => {
    setSending(true);
    setSuccess(false);
    setErrorMsg('');
    try {
      const blob = await pdf(<RendererPdfCreate contract={contract} lang={lang} />).toBlob();

      const formData = new FormData();
      formData.append('client_email', contract.client_email);
      formData.append('provider_email', contract.provider_email);
      formData.append('payment_link', 'https://pagamento.com/123'); // ou gere dinamicamente
      formData.append('contract_id', contract.id);
      formData.append('pdf', blob, 'contrato.pdf');

      // n8n local no meu computador
      const webhookUrl = 'http://localhost:5678/webhook-test/send-contract';

      // no string.com - dando erro no gmail para enviar
      // const webhookUrl = 'https://eon5o43oujgr0vh.m.pipedream.net';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar contrato para o n8n');
      }

      setSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('Erro desconhecido ao enviar contrato.');
      }
    } finally {
      setSending(false);
    }
  };

  const t = contractTexts[lang];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white max-w-3xl w-full rounded-xl shadow-lg p-0 relative overflow-y-auto max-h-[90vh]">
        {/* Header fixo do modal */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-8 py-4 rounded-t-xl">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-black">{t.contract_preview}</span>

            {/* Botão de envio por e-mail */}
            <div className="mb-4">
              <button
                onClick={sendContractToN8N}
                disabled={sending}
                className={`inline-flex items-center mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white 
                  ${sending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {t.sending}
                  </>
                ) : (
                  t.send_email
                )}
              </button>

              {success && (
                <div className="mt-2 text-green-600 font-semibold">
                  {t.email_sent_success}
                </div>
              )}
              {errorMsg && (
                <div className="mt-2 text-red-600 font-semibold">
                  {t.email_sent_error}
                </div>
              )}
            </div>
          </div>

          <select
            value={lang}
            onChange={e => setLang(e.target.value as 'en' | 'pt')}
            className="px-3 py-2 border border-gray-300 rounded-lg mt-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-blue-600 text-2xl font-bold"
            title="Close"
          >
            &times;
          </button>
        </div>

        {/* Conteúdo do contrato */}
        <div className="p-8">
        <PDFViewer width="100%" height="600">
          <RendererPdfCreate contract={contract} lang={lang} />
        </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export default ViewContract;
