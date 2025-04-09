'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

interface TargetValueFunction extends React.FormEvent<HTMLFormElement> {
  target: HTMLFormElement
}

export default function LoginForm() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: TargetValueFunction) => {
    e.preventDefault()
    const email = e.target.email.value

    const res = await signIn('email', {
      email,
      redirect: false,
    })

    if (res?.error) {
      setError(true)
      setSuccess(false)
    } else {
      setSuccess(true)
      setError(false)
    }
  }

  return (
    <div className="bg-surface border border-border/30 p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-text">🔐 Login</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Digite seu email"
            className="w-full px-4 py-2 bg-background border border-border text-text placeholder:text-textMuted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center">
            ⚠️ Erro ao tentar fazer login
          </div>
        )}
        {success && (
          <div className="text-green-400 text-sm text-center">
            ✅ Verifique seu e-mail!
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary hover:bg-violet-500 text-white py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
