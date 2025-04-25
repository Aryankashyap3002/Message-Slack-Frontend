import combineContext from '@/utils/combineContext';

 import { AuthContextProvider } from './AuthContext';
 import { ChannelMessagesProvider } from './CHannelMessages';
 import { CreateChannelContextProvider } from './CreateChannelContext';
 import { CreateWorkspaceContextProvider } from './CreateWorkspaceContext';
import { SidebarToggleProvider } from './SidebarToggleContext';
 import { SocketContextProvider } from './SocketContext';
 import { WorkspaceContextProvider } from './WorkspaceContext';
 import { WorkspacePreferencesModalContextProvider } from './WorkspacePreferencesModalContext';
 
 export const AppContextProvider = combineContext(
     ChannelMessagesProvider,
     SocketContextProvider,
     AuthContextProvider,
     WorkspaceContextProvider,
     CreateWorkspaceContextProvider,
     WorkspacePreferencesModalContextProvider,
     CreateChannelContextProvider,
     SidebarToggleProvider
 ); 