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
    <div className="border-border/30 sm:p-8 rounded w-full max-w-md">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-4 sm:mb-6">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Digite seu e-mail"
            className="w-full px-4 py-2 bg-background border border-border placeholder:text-textMuted rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center animate-pulse">
            ⚠️ Erro ao tentar fazer login. Verifique seu e-mail e tente novamente.
          </div>
        )}

        {success && (
          <div className="text-green-500 text-sm text-center animate-pulse">
            ✅ E-mail enviado! Verifique sua caixa de entrada.
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Enviar código de acesso
        </button>

        <p className="text-sm text-center text-textMuted mt-2">
          Um e-mail com seu código de acesso será enviado. Verifique também a caixa de spam e lixeira.
        </p>
      </form>
    </div>
  )
}
