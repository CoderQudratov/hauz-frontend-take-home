import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

import { authQueryOptions } from '#/lib/auth-query'
import { updateProfile } from '#/lib/profile-fns'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.user) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    }
    if (!context.auth.account) {
      throw redirect({ to: '/onboarding', search: { redirect: location.href } })
    }
  },
  component: Profile,
})

function Profile() {
  const { auth } = Route.useRouteContext()
  const account = auth.account!
  const queryClient = useQueryClient()
  const router = useRouter()

  const [firstName, setFirstName] = useState(account.firstName)
  const [lastName, setLastName] = useState(account.lastName)
  const [contactEmail, setContactEmail] = useState(account.contactEmail ?? '')
  const [bio, setBio] = useState(account.bio ?? '')

  const submit = useMutation({
    mutationFn: () =>
      updateProfile({
        data: {
          firstName,
          lastName,
          contactEmail: contactEmail.trim() === '' ? null : contactEmail.trim(),
          bio: bio.trim() === '' ? null : bio.trim(),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryOptions().queryKey })
      await router.invalidate()
    },
  })

  return (
    <main>
      <h1>Your profile</h1>
      <p>Role: {account.role === 'property_owner' ? 'Property Owner' : 'Realtor'}</p>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit.mutate()
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

        <label htmlFor="contactEmail">Contact email</label>
        <input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(event) => setContactEmail(event.target.value)}
        />

        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          rows={4}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />

        <button type="submit" disabled={submit.isPending}>
          Save
        </button>
      </form>
      {submit.isError && <p role="alert">{submit.error.message}</p>}
      {submit.isSuccess && <p>Saved.</p>}
    </main>
  )
}
