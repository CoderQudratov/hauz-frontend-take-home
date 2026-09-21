import { Link, useNavigate, useRouteContext, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authQueryOptions } from '#/lib/auth-query'
import { logout } from '#/lib/auth-fns'

export function Header() {
  const { auth } = useRouteContext({ from: '__root__' })
  const queryClient = useQueryClient()
  const router = useRouter()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey })
      await router.invalidate()
      await navigate({ to: '/' })
    },
  })

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
        paddingBottom: '1rem',
      }}
    >
      <Link to="/">HAUZ</Link>
      {auth.user ? (
        <span style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/profile">{auth.account?.firstName ?? auth.user.email}</Link>
          <button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Log out
          </button>
        </span>
      ) : (
        <Link to="/sign-in">Sign in</Link>
      )}
    </header>
  )
}
