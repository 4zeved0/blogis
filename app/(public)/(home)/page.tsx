'use client'

import { useQuery } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'
import { getPosts } from '@/app/lib/queries'
import PostCard from '@/app/components/PostCard'
import SkeletonPostCard from '@/app/components/SkepetonPostCard'
import { useMemo, useState } from 'react'
import SearchBar from '@/app/components/searchBar'


interface Post {
  _id: string
  title: string
  slug: { current: string }
  body: any
  publishedAt: string
  author?: { name: string }
  mainImage?: {
    asset: {
      _ref: string
    }
  }
}

export default function App() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 180000,
    gcTime: 600000,
  })

  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = useMemo(() => {
    if (!posts) return []
    return posts.filter((post: Post) => {
      const title = post.title?.toLowerCase() || ''
      const author = post.author?.name?.toLowerCase() || ''
      return title.includes(searchTerm) || author.includes(searchTerm)
    })
  }, [posts, searchTerm])

  return (
    <main className="min-h-screen bg-background text-text px-4 py-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="grid gap-4 sm:grid-cols-[1fr_auto_auto] items-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight col-span-full sm:col-span-1">
            ✨ My Blog
          </h1>

          <div className="sm:justify-self-center sm:col-span-1 w-full sm:w-auto">
            <SearchBar onSearch={setSearchTerm} />
          </div>

          <button
            onClick={() => signIn()}
            className="bg-primary hover:bg-violet-500 text-white px-5 py-2 rounded-xl shadow transition-all duration-200 focus:ring-2 focus:ring-primary sm:col-span-1 sm:justify-self-end"
          >
            Fazer Login
          </button>
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonPostCard key={i} />
            ))
            : filteredPosts.map((post: Post) => (
              <PostCard
                key={post._id}
                id={post._id}
                title={post.title}
                slug={post.slug.current}
                body={post.body}
                publishedAt={post.publishedAt}
                author={post.author}
                mainImage={post.mainImage}
              />
            ))}
        </section>
      </div>
    </main>
  )
}