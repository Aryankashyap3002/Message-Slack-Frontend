import { useQuery } from '@tanstack/react-query';

import { getAllProjects } from '../../../apis/projects';

export const useGetAllProjects = (workspaceId) => {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: () => getAllProjects({ workspaceId }),
    enabled: !!workspaceId,
    staleTime: 60000, // 1 minute
  });
};