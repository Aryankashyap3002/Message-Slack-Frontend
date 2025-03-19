import './App.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


 import { AppContextProvider } from './context/AppContextProvider';
 import { Toaster } from "@/components/ui/sonner";
 import { AppRoutes } from '@/Routes';

function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <AppRoutes />
        <Toaster />
      </AppContextProvider>
    </QueryClientProvider>
    
  )
}

export default App
