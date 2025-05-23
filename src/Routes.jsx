import { Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/components/molecules/ProtectedRoute/ProtectedRoute';
import { SigninContainer } from '@/components/organisms/Auth/SigninContainer';
import { SignupContainer } from '@/components/organisms/Auth/SignupContainer';
import { Auth } from '@/pages/Auth/Auth';
import { Home } from '@/pages/Home/Home';
import { Notfound } from '@/pages/Notfound/Notfound';
import { WorkspaceLayout } from '@/pages/Workspace/Layout';

import { WorkspaceSidebar } from './components/organisms/Workspace/WorkspaceSidebar';
import { Payments } from './pages/Payments/Payments';
import { ProjectPlayground } from './pages/ProjectPlayground'; 
import { Channel } from './pages/Workspace/Channel/Channel';
import { JoinPage } from './pages/Workspace/JoinPage';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/signup" element={<Auth><SignupContainer /></Auth>} />
            <Route path="/" element={<Auth><SigninContainer /></Auth>} />
            <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
            <Route path="/workspaces/:workspaceId" element={<ProtectedRoute><WorkspaceLayout>Workspace</WorkspaceLayout></ProtectedRoute>} />
            <Route 
                path="/workspaces/:workspaceId/channels/:channelId"
                element={<ProtectedRoute><WorkspaceLayout><Channel /></WorkspaceLayout></ProtectedRoute>}
            />
            
            {/* Project routes */}
            <Route 
                path="/workspaces/:workspaceId/projects/:projectId"
                element={<ProtectedRoute><WorkspaceLayout><ProjectPlayground /></WorkspaceLayout></ProtectedRoute>}
            />
            <Route path="/create-project" element={<ProtectedRoute><WorkspaceSidebar /></ProtectedRoute>} />
            
            <Route path="/makepayment" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/workspaces/join/:workspaceId" element={<JoinPage />} />
            
            {/* Catch-all route */}
            <Route path="/*" element={<Notfound />} />
        </Routes>
    );
};