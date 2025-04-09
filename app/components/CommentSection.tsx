'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'

interface Comment {
  _id: string
  name: string
  comment: string
  _createdAt: string
}

export function CommentSection({ postId }: { postId: string }) {
  const { data: session } = useSession()

  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const commentListRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    fetch(`/api/comments?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
  }, [postId, submitted])

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email)
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ name, email, comment, postId }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setSubmitted(true)
      setName('')
      setComment('')

      setTimeout(() => {
        setSubmitted(false)
        commentListRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 1000)
    } catch (err) {
      console.error('Erro ao enviar comentário:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mt-24 border-t border-border pt-12">
      <h2 className="text-2xl font-semibold mb-8 text-text">Comentários</h2>

      {comments.length > 0 ? (
        <ul ref={commentListRef} className="space-y-5 mb-12">
          {comments.map((c) => (
            <li
              key={c._id}
              className="border border-border p-4 rounded-lg bg-surface hover:ring-1 hover:ring-primary"
            >
              <p className="text-sm text-text mb-1">{c.comment}</p>
              <span className="text-xs text-textMuted">
                — {c.name} em{' '}
                {new Date(c._createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-textMuted mb-10 text-sm">
          Nenhum comentário ainda.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm text-textMuted mb-1">
              Nome
            </label>
            <input
              type="text"
              id="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-surface text-text border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-textMuted mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              disabled
              className="w-full px-3 py-2 bg-surface text-textMuted border border-border rounded text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm text-textMuted mb-1">
            Comentário
          </label>
          <textarea
            id="comment"
            placeholder="Escreva algo..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full px-3 py-2 bg-surface text-text border border-border rounded h-28 resize-none focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-5 py-2 rounded text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>

          {submitted && (
            <span className="text-green-400 text-sm">Comentário enviado!</span>
          )}
        </div>
      </form>
    </section>

  )
}
