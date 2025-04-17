'use client'

import { useQuery } from '@tanstack/react-query'
import { signIn, useSession } from 'next-auth/react'
import { getPosts } from '@/app/lib/queries'

import { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'

import myImage from '@/assets/logo.png'
import PostCard from '@/app/components/PostCard'
import SkeletonPostCard from '@/app/components/SkepetonPostCard'
import { authors } from '@/app/data/Authors'
import SearchBar from '@/app/components/SearchBar'
import AboutProject from '@/app/components/AboutProject'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  body: any
  publishedAt: string
  author?: { name: string }
  mainImage?: { asset: { _ref: string } }
  categories?: { title: string }[]
}

export default function App() {
  const { data: session } = useSession()

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 180000,
    gcTime: 600000,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showPosts, setShowPosts] = useState(false)

  const filteredPosts = useMemo(() => {
    if (!posts) return []

    const byCategory = selectedCategory
      ? posts.filter((post: Post) =>
        post.categories?.some((category) => category.title === selectedCategory)
      )
      : posts

    return byCategory.filter((post: Post) => {
      const title = post.title?.toLowerCase() || ''
      const author = post.author?.name?.toLowerCase() || ''
      return title.includes(searchTerm.toLowerCase()) || author.includes(searchTerm.toLowerCase())
    })
  }, [posts, searchTerm, selectedCategory])

  const categories = useMemo(() => {
    const all: string[] = []
    posts?.forEach((post: Post) => {
      post.categories?.forEach((cat) => {
        if (!all.includes(cat.title)) all.push(cat.title)
      })
    })
    return all
  }, [posts])

  useEffect(() => {
    setShowPosts(false)
    const timer = setTimeout(() => setShowPosts(true), 100)
    return () => clearTimeout(timer)
  }, [selectedCategory])

  return (
    <main className="min-h-screen bg-background text-text px-4 py-10 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="grid gap-4 sm:grid-cols-[1fr_auto_auto] items-center mb-12">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <Image src={myImage} width={100} height={100} alt="Logo" className="rounded" />
          </div>

          <div className="w-full">
            <SearchBar onSearch={setSearchTerm} />
          </div>

          {session ? (
            <h1 className="text-center sm:justify-self-end font-medium">Bem vindo!</h1>
          ) : (
            <button
              onClick={() => signIn()}
              className="sm:border-primary sm:bg-transparent sm:border-2 bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded transition-all duration-200 focus:ring-2 focus:ring-primary sm:justify-self-end"
            >
              Fazer Login
            </button>
          )}
        </header>


        {/* Category Filter */}
        <div className="flex gap-4 flex-wrap mb-8">
          <button
            className={`px-4 py-2 rounded transition-all ${!selectedCategory ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
            onClick={() => setSelectedCategory('')}
          >
            Todas
          </button>
          {categories.slice(0, 6).map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded transition-colors duration-300 ${selectedCategory === category ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>


        {/* Posts */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <h1 className="col-span-full text-3xl font-bold text-center sm:text-left">Recentes</h1>

          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonPostCard key={i} />)
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post: Post) => (
              <PostCard
                key={post._id}
                id={post._id}
                title={post.title}
                slug={post.slug.current}
                body={post.body}
                publishedAt={post.publishedAt}
                author={post.author}
                mainImage={post.mainImage}
                categories={post.categories}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">Não encontrado.</p>
          )}
        </section>



        {/* Redatores */}
        <section className='mb-24'>
          <div>
            <h1 className="text-3xl font-bold mb-10 text-center sm:text-left">Redatores</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {authors.map((author, index) => (
                <div
                  key={index}
                  className="relative bg-card border border-border rounded p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] flex flex-col items-center gap-4 hover:ring-1 hover:ring-primary text-center"
                >
                  <div className="w-48 h-48 rounded-full overflow-hidden">
                    <Image
                      src={author.image}
                      alt={`Foto de ${author.name}`}
                      className="w-full h-full object-cover"
                      width={192}
                      height={192}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{author.name}</h3>
                  <p className="text-sm text-muted-foreground">{author.description}</p>
                  <span className="mt-2 text-xs px-3 py-1 bg-primary text-textMuted rounded">
                    {author.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Sobre */}
        {/* <section className='mb-24'>
          <h1 className='text-3xl font-bold mb-10 text-center sm:text-left'>Sobre</h1>
        </section> */}
      </div>
    </main>
  )
}
