import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main>
      <h1>HAUZ</h1>
      <p>
        Nothing is built yet. Read <code>TASK.md</code> for what to build and{' '}
        <code>README.md</code> for how to connect this to your own Appwrite
        project.
      </p>
    </main>
  )
}
