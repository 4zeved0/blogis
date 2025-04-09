import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'ulzdyd69',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2025-02-06',
  token: process.env.SANITY_SECRET_TOKEN,
})

export async function POST(req: Request) {
  const body = await req.json()

  try {
    const comment = await client.create({
      _type: 'comment',
      name: body.name,
      email: body.email,
      comment: body.comment,
      post: {
        _type: 'reference',
        _ref: body.postId,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao salvar comentário', error }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')

  if (!postId) return NextResponse.json([], { status: 400 })

  const comments = await client.fetch(
    `*[_type == "comment" && post._ref == $postId && approved == true] | order(_createdAt desc){
        _id, name, comment, _createdAt
      }`,
    { postId }
  )


  return NextResponse.json(comments)
}
