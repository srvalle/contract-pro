import { useState } from 'react';
import { supabase } from '../supabaseClient';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signUp(email: string, password: string, name: string) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name }
      }
    });
    setLoading(false);
    if (error) setError(error.message);
    return !error;
  }

  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    return !error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { signUp, signIn, signOut, loading, error };
}
