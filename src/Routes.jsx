import { Route, Routes } from 'react-router-dom';
 
 import { SigninContainer } from '@/components/organisms/Auth/SigninContainer';
 import { SignupContainer } from '@/components/organisms/Auth/SignupContainer';
 import { Auth } from '@/pages/Auth/Auth';
 import { Notfound } from '@/pages/Notfound/Notfound';
 import { JoinPage } from './pages/Workspace/JoinPage';
 import { ProtectedRoute } from '@/components/molecules/ProtectedRoute/ProtectedRoute';
import { Home } from '@/pages/Home/Home';
import { WorkspaceLayout } from '@/pages/Workspace/Layout';

 
 export const AppRoutes = () => {
     return (
         <Routes>
           <Route path="/auth/signup" element={<Auth><SignupContainer /></Auth>} />
           <Route path="/auth/signin" element={<Auth><SigninContainer /></Auth>} />
           <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
           <Route path="/workspaces/:workspaceId" element={<ProtectedRoute><WorkspaceLayout>Workspace</WorkspaceLayout></ProtectedRoute>} />
           <Route 
             path="/workspaces/:workspaceId/channels/:channelId"
             element={<ProtectedRoute>Channel</ProtectedRoute>}
 
           />
           <Route path="/workspaces/join/:workspaceId" element={<JoinPage />} />
           <Route path="/*" element={<Notfound />} />
         </Routes>
     );
 };