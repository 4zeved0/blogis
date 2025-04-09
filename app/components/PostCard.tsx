'use client'

import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'

interface PostCardProps {
  id: string
  title: string
  slug: string
  body: Block[]
  publishedAt: string
  author?: {
    name: string
  }
  mainImage?: {
    asset: {
      _ref: string
    }
  }
}

interface Span {
  _key: string
  _type: 'span'
  text: string
  marks: string[]
}

interface Block {
  _key: string
  _type: 'block'
  children: Span[]
  style: string
  markDefs: any[]
}

function getPlainText(blocks: Block[]): string {
  return blocks
    .map((block) => {
      if (block._type === 'block' && Array.isArray(block.children)) {
        return block.children.map((child) => child.text).join('')
      }
      return ''
    })
    .join('\n')
}

export default function PostCard({
  id,
  title,
  slug,
  body,
  publishedAt,
  author,
  mainImage
}: PostCardProps) {
  const plainText = getPlainText(body)
  const preview =
    plainText.length > 300 ? plainText.slice(0, 200).trim() + '...' : plainText

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    : 'Data desconhecida'

  return (
    <Link key={id} href={`/posts/${slug}`} passHref>
      <article className="bg-card border border-border rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] flex flex-col gap-4 h-[420px]  hover:ring-1 hover:ring-primary">
        {mainImage?.asset?._ref ? (
          <img
            src={urlFor(mainImage.asset._ref).width(800).height(400).url()}
            alt={`Imagem de ${title}`}
            className="w-full h-44 object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-44 bg-muted rounded-xl flex items-center justify-center text-sm text-muted-foreground">
            Sem imagem
          </div>
        )}

        <h2 className="text-lg font-semibold text-foreground text-center relative group">
          <span className="group-hover:text-primary transition-colors duration-200">
            {title}
          </span>
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-1/2"></span>
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {preview}
        </p>

        <div className="mt-auto pt-2 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
          <span>✍️ {author?.name || 'Desconhecido'}</span>
          <span>📅 {formattedDate}</span>
        </div>
      </article>
    </Link>
  )
}
