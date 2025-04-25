// src/hooks/apis/queries/useGetWorkspaces.js
import { useQuery } from '@tanstack/react-query';

import { fetchWorkspacesRequest } from '@/apis/workspaces';
import { useAuth } from '@/hooks/context/useAuth';

export const useGetWorkspaces = () => {
    const { auth } = useAuth();
    
    const { isFetching, isSuccess, error, data: workspaces } = useQuery({
        queryFn: () => fetchWorkspacesRequest({ token: auth?.token }),
        queryKey: ['fetchWorkspaces'],
        staleTime: 60000, // 1 minute cache
        enabled: !!auth?.token
    });

    return {
        isFetching,
        isSuccess,
        error,
        workspaces
    };
};