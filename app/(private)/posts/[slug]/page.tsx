'use client'

import { useQuery } from '@tanstack/react-query'
import { getPostBySlug } from '@/app/lib/queries'
import { PortableText } from '@portabletext/react'
import { CommentSection } from '@/app/components/CommentSection'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PostPage() {
  const { slug } = useParams() as { slug: string }

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug),
    staleTime: 180000,
    gcTime: 600000
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-text px-6 py-12 font-sans">
        Carregando post...
      </div>
    );
  }

  if (isError || !post) {
    return <div className="text-center text-red-500 mt-10">Post não encontrado.</div>
  }

  return (
    <main className="min-h-screen bg-background text-text px-6 py-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="bg-surface rounded-md p-3 text-secondary text-sm font-medium hover:underline hover:text-primary/80 transition mb-6 inline-block"
        >
          <div className="flex gap-2 items-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22.5 12C22.5 11.8011 22.421 11.6103 22.2803 11.4696C22.1397 11.329 21.9489 11.25 21.75 11.25H4.0605L8.781 6.53097C9.00095 6.09859 9.00095 5.90135 8.781 5.46897C8.62848 5.34392 8.34861 5.24902 8.25 5.24902C8.15138 5.24902 7.96262 5.30619 7.719 5.46897L1.719 11.469C1.49866 11.9013 1.49866 12.0986 1.719 12.531L7.719 18.531C7.78873 18.6007 8.15138 18.7509 8.53737 18.6938C8.85073 18.4612 9.00095 18.0986 8.781 17.469L4.0605 12.75H21.75C21.9489 12.75 22.1397 12.671 22.2803 12.5303C22.421 12.3896 22.5 12.1989 22.5 12Z"
                fill="white"
              />
            </svg>
            <h3>Voltar para posts</h3>
          </div>
        </Link>

        {post.mainImage?.asset?._ref && (
          <img
            src={urlFor(post.mainImage.asset._ref).width(1200).height(600).url()}
            alt={post.title}
            className="w-full h-64 object-cover rounded-xl mb-8 shadow-md"
          />
        )}

        <h1 className="text-4xl font-bold mb-4 leading-snug tracking-tight">{post.title}</h1>

        <p className="text-sm text-muted-foreground mb-8">
          ✍️ {post.author?.name ?? 'Desconhecido'} &middot;{' '}
          {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </p>

        <div className="prose prose-invert prose-sm sm:prose-base max-w-none mb-12 ">
          <PortableText value={post.body} />
        </div>

        <CommentSection postId={post._id} />
      </div>
    </main>
  )
}
