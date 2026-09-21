import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

import { authQueryOptions } from '#/lib/auth-query'
import { requestEmailCode, verifyEmailCode } from '#/lib/auth-fns'
import { safeRedirectTarget } from '#/lib/safe-redirect'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/sign-in')({
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => {
    if (context.auth.user) {
      throw redirectAfterSignIn(context.auth.account !== null, search.redirect)
    }
  },
  component: SignIn,
})

function redirectAfterSignIn(hasAccount: boolean, redirectTo: string | undefined) {
  const target = safeRedirectTarget(redirectTo)
  if (!hasAccount) {
    return redirect({ to: '/onboarding', search: { redirect: target } })
  }
  return redirect({ to: target })
}

function SignIn() {
  const { redirect: redirectTo } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [code, setCode] = useState('')

  const requestCode = useMutation({
    mutationFn: () => requestEmailCode({ data: { email } }),
    onSuccess: (result) => {
      setUserId(result.userId)
      setStep('code')
    },
  })

  const verifyCode = useMutation({
    mutationFn: () => verifyEmailCode({ data: { userId, secret: code } }),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey })
      const target = safeRedirectTarget(redirectTo)
      if (result.needsOnboarding) {
        await navigate({ to: '/onboarding', search: { redirect: target } })
      } else {
        await navigate({ to: target })
      }
    },
  })

  if (step === 'email') {
    return (
      <main>
        <h1>Sign in</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            requestCode.mutate()
          }}
        >
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit" disabled={requestCode.isPending}>
            Send code
          </button>
        </form>
        {requestCode.isError && <p role="alert">{requestCode.error.message}</p>}
      </main>
    )
  }

  return (
    <main>
      <h1>Enter your code</h1>
      <p>We sent a sign-in code to {email}.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          verifyCode.mutate()
        }}
      >
        <label htmlFor="code">Code</label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          required
          autoFocus
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
        <button type="submit" disabled={verifyCode.isPending}>
          Continue
        </button>
      </form>
      {verifyCode.isError && <p role="alert">{verifyCode.error.message}</p>}
      <button type="button" onClick={() => setStep('email')}>
        Use a different email
      </button>
    </main>
  )
}
