import React, { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { supabase } from "../supabaseClient";

const Settings: React.FC = () => {
  const { user } = useAuthContext();

  // Estados para os campos
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Atualizar nome de usuário
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });

    setLoading(false);
    if (error) setError(error.message);
    else setMessage("Nome atualizado com sucesso!");
  };

  // Atualizar email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ email });

    setLoading(false);
    if (error) setError(error.message);
    else setMessage("Email atualizado! Verifique sua caixa de entrada para confirmar.");
  };

  // Atualizar senha
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) setError(error.message);
    else setMessage("Senha atualizada com sucesso!");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-lg mx-auto pt-24 pb-8">
      <h1 className="text-2xl font-bold mb-6">Configurações da Conta</h1>

      {message && <div className="mb-4 text-green-600">{message}</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Alterar nome */}
        <form onSubmit={handleUpdateName} className="mb-6 border p-6 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            Salvar nome
          </button>
        </form>

        {/* Alterar email */}
        <form onSubmit={handleUpdateEmail} className="mb-6 border p-6 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            Salvar email
          </button>
        </form>

        {/* Alterar senha */}
        <form onSubmit={handleUpdatePassword} className="mb-6 border p-6 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            minLength={6}
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-2 mt-2">Confirm New password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
            minLength={6}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            Salvar senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
