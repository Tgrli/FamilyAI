import {
  UseQueryOptions,
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  QueryObserverResult,
  UseQueryResult
} from '@tanstack/react-query';
import * as t from './types';
import * as dataService from './data-service';

export enum QueryKeys {
  messages = 'messsages',
  allConversations = 'allConversations',
  conversation = 'conversation',
  searchEnabled = 'searchEnabled',
  user = 'user',
  endpoints = 'endpoints',
  presets = 'presets',
  searchResults = 'searchResults',
  tokenCount = 'tokenCount'
}

export const useAbortRequestWithMessage = (): UseMutationResult<
  void,
  Error,
  { endpoint: string; abortKey: string; message: string }
> => {
  return useMutation(({ endpoint, abortKey, message }) =>
    dataService.abortRequestWithMessage(endpoint, abortKey, message)
  );
};

export const useGetUserQuery = (
  config?: UseQueryOptions<t.TUser>
): QueryObserverResult<t.TUser> => {
  return useQuery<t.TUser>([QueryKeys.user], () => dataService.getUser(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    ...config
  });
};

export const useGetMessagesByConvoId = (
  id: string,
  config?: UseQueryOptions<t.TMessage[]>
): QueryObserverResult<t.TMessage[]> => {
  return useQuery<t.TMessage[]>(
    [QueryKeys.messages, id],
    () => dataService.getMessagesByConvoId(id),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config
    }
  );
};

export const useGetConversationByIdQuery = (
  id: string,
  config?: UseQueryOptions<t.TConversation>
): QueryObserverResult<t.TConversation> => {
  return useQuery<t.TConversation>(
    [QueryKeys.conversation, id],
    () => dataService.getConversationById(id),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config
    }
  );
};

//This isn't ideal because its just a query and we're using mutation, but it was the only way
//to make it work with how the Chat component is structured
export const useGetConversationByIdMutation = (id: string): UseMutationResult<t.TConversation> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.getConversationById(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.conversation, id]);
    }
  });
};

export const useUpdateConversationMutation = (
  id: string
): UseMutationResult<
  t.TUpdateConversationResponse,
  unknown,
  t.TUpdateConversationRequest,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: t.TUpdateConversationRequest) => dataService.updateConversation(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.conversation, id]);
        queryClient.invalidateQueries([QueryKeys.allConversations]);
      }
    }
  );
};

export const useDeleteConversationMutation = (
  id?: string
): UseMutationResult<
  t.TDeleteConversationResponse,
  unknown,
  t.TDeleteConversationRequest,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: t.TDeleteConversationRequest) => dataService.deleteConversation(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.conversation, id]);
        queryClient.invalidateQueries([QueryKeys.allConversations]);
      }
    }
  );
};

export const useClearConversationsMutation = (): UseMutationResult<unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.clearAllConversations(), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.allConversations]);
    }
  });
};

export const useGetConversationsQuery = (
  pageNumber: string,
  config?: UseQueryOptions<t.TConversation[]>
): UseQueryResult<t.TConversation[] | unknown> => {
  return useQuery(
    [QueryKeys.allConversations, pageNumber],
    // @ts-ignore - can't find the solution to this
    () => dataService.getConversations(pageNumber),
    {
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
      ...config
    }
  );
};

export const useGetSearchEnabledQuery = (
  config?: UseQueryOptions<boolean>
): QueryObserverResult<boolean> => {
  return useQuery<boolean>([QueryKeys.searchEnabled], () => dataService.getSearchEnabled(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...config
  });
};

export const useGetEndpointsQuery = (): QueryObserverResult<t.TEndpoints> => {
  return useQuery([QueryKeys.endpoints], () => dataService.getAIEndpoints(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  });
};

export const useCreatePresetMutation = (): UseMutationResult<
  t.TPreset[],
  unknown,
  t.TPreset,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TPreset) => dataService.createPreset(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.presets]);
    }
  });
};

export const useUpdatePresetMutation = (): UseMutationResult<
  t.TPreset[],
  unknown,
  t.TPreset,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TPreset) => dataService.updatePreset(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.presets]);
    }
  });
};

export const useGetPresetsQuery = (
  config?: UseQueryOptions<t.TPreset[]>
): QueryObserverResult<t.TPreset[], unknown> => {
  return useQuery<t.TPreset[]>([QueryKeys.presets], () => dataService.getPresets(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...config
  });
};

export const useDeletePresetMutation = (): UseMutationResult<
  t.TPreset[],
  unknown,
  t.TPreset | object,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TPreset | object) => dataService.deletePreset(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.presets]);
    }
  });
};

export const useSearchQuery = (
  searchQuery: string,
  pageNumber: string,
  config?: UseQueryOptions<t.TSearchResults>
): QueryObserverResult<t.TSearchResults> => {
  return useQuery<t.TSearchResults>(
    [QueryKeys.searchResults, pageNumber, searchQuery],
    () => dataService.searchConversations(searchQuery, pageNumber),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config
    }
  );
};

export const useUpdateTokenCountMutation = (): UseMutationResult<
  t.TUpdateTokenCountResponse,
  unknown,
  string,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((text: string) => dataService.updateTokenCount(text), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.tokenCount]);
    }
  });
};

export const useLoginUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TLoginUser) => dataService.login(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.user]);
    }
  });
};

export const useRegisterUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: t.TRegisterUser) => dataService.register(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.user]);
    }
  });
};

export const useLogoutUserMutation = (): UseMutationResult<unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.logout(), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.user]);
    }
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation(() => dataService.refreshToken(), {});
};

export const useRequestPasswordResetMutation = () => {
  return useMutation((payload: t.TRequestPasswordReset) =>
    dataService.requestPasswordReset(payload)
  );
};

export const useResetPasswordMutation = () => {
  return useMutation((payload: t.TResetPassword) => dataService.resetPassword(payload));
};

export const useGetUserListQuery = (searchQuery: string): UseQueryResult<t.TUser[] | unknown> => {
  return useQuery([searchQuery], () => dataService.getUserList(searchQuery), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false
  });
};

export const useUpdateUserRoleMutation = (): UseMutationResult<unknown> => {
  const queryClient = useQueryClient();
  // @ts-ignore ignore line
  return useMutation((id: string, payload: t.TUpdateUserRole) => dataService.updateUserRole(id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.user]);
      }
    }
  );
};

export const useCreateInviteMutation = (): UseMutationResult<t.TInvite | unknown> => {
  const queryClient = useQueryClient();
  // @ts-ignore ignore line
  return useMutation((payload: t.TCreateInvite) => dataService.createInvite(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.user]);
    }
  });
};

export const useDeleteInviteMutation = (): UseMutationResult<unknown> => {
  const queryClient = useQueryClient();
  // @ts-ignore ignore line
  return useMutation((id: string) => dataService.deleteInvite(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.user]);
    }
  });
}
