import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { auth } = Route.useRouteContext()

  return (
    <main>
      <h1>HAUZ</h1>
      <p>
        {auth.user
          ? `Welcome back${auth.account ? `, ${auth.account.firstName}` : ''}.`
          : 'Sign in to manage your listings.'}
      </p>
    </main>
  )
}
