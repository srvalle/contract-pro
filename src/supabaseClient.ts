import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ulbldzbfzyqghnhuyaiz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYmxkemJmenlxZ2huaHV5YWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ2NzAsImV4cCI6MjA2ODA4MDY3MH0.yXJDo0sIrNiE4lpBh3K4QmRYa7HA_M79YbmAt7QzqSM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
