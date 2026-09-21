import { queryOptions } from '@tanstack/react-query'

import { getAuthState } from './auth-fns'

export const authQueryOptions = () =>
  queryOptions({
    queryKey: ['auth'] as const,
    queryFn: () => getAuthState(),
  })
