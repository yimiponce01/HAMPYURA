import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function App() {

useEffect(() => {
const test = async () => {
const { data, error } = await supabase
.from('perfiles')
.select('*');


  console.log('DATA:', data);
  console.log('ERROR:', error);
};

test();


}, []);

return ( <ThemeProvider> <AccessibilityProvider> <AuthProvider> <RouterProvider router={router} /> </AuthProvider> </AccessibilityProvider> </ThemeProvider>
);
}
