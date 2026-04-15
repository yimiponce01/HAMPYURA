import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezrviryjunnzpdfsuxbz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cnZpcnlqdW5uenBkZnN1eGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTkzODksImV4cCI6MjA5MTgzNTM4OX0.IRaQvVYW-wweZyEa2FSN3z1rsvlkgt4gPADzprhZsUE'

export const supabase = createClient(supabaseUrl, supabaseKey)