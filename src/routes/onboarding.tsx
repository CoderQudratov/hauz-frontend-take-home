import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

import { authQueryOptions } from '#/lib/auth-query'
import { completeOnboarding } from '#/lib/profile-fns'
import type { PersonalRole } from '#/lib/personal-account'
import { safeRedirectTarget } from '#/lib/safe-redirect'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/onboarding')({
  validateSearch: searchSchema,
  beforeLoad: ({ context, search }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: safeRedirectTarget(search.redirect) },
      })
    }
    // Someone who already has an account skips onboarding entirely.
    if (context.auth.account) {
      throw redirect({ to: safeRedirectTarget(search.redirect) })
    }
  },
  component: Onboarding,
})

function Onboarding() {
  const { redirect: redirectTo } = Route.useSearch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<PersonalRole>('property_owner')

  const submit = useMutation({
    mutationFn: () => completeOnboarding({ data: { firstName, lastName, role } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey })
      await navigate({ to: safeRedirectTarget(redirectTo) })
    },
  })

  return (
    <main>
      <h1>Tell us about you</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!submit.isPending) {
            submit.mutate()
          }
        }}
      >
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          required
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />

        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          required
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />

        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value as PersonalRole)}
        >
          <option value="property_owner">Property Owner</option>
          <option value="realtor">Realtor</option>
        </select>
        <p>You cannot change your role after your account is created.</p>

        <button type="submit" disabled={submit.isPending}>
          Continue
        </button>
      </form>
      {submit.isError && <p role="alert">{submit.error.message}</p>}
    </main>
  )
}
