import { useMutation } from '@tanstack/react-query';

import { joinWorkspaceRequest } from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

// Hooks file remains the same
export const useJoinWorkspaceRequest = (workspaceId) => {
    const { auth } = useAuth();
    const { mutateAsync: joinWorkspaceMutation, isSuccess, isPending, error} = useMutation({
        mutationFn: (joinCode) => joinWorkspaceRequest({ workspaceId, joinCode, token: auth?.token }),
        onSuccess: () => {
            console.log('Workspace joined successfully');
        },
        onError: (error) => {
            console.log('Error in joining workspace', error);
        }
    });

    return {
        joinWorkspaceMutation,
        isSuccess,
        isPending,
        error
    };
};