import { client } from './sanity'
import { groq } from 'next-sanity'

export async function getPosts() {
  const query = `
  *[_type == "post"]{
    _id,
    title,
    slug,
    body,
    publishedAt,
    mainImage,
    author->{
      name
    }
  }
  `
  return await client.fetch(query)
}



// Buscar post por slug
export async function getPostBySlug(slug: string) {
  const query = groq`*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    body,
    publishedAt,
    mainImage,
    author->{
      name
    }
  }`
  return await client.fetch(query, { slug })
}


export async function getCommentsByPostId(postId: string) {
  const query = groq`
    *[_type == "comment" && post._ref == $postId] | order(_createdAt desc) {
      _id,
      name,
      comment,
      _createdAt
    }
  `

  return await client.fetch(query, { postId })
}


export const getPostsQuery = `
  *[_type == "post"]{
    _id,
    title,
    slug,
    body,
    publishedAt,
    "mainImage": mainImage{
      asset->{
        _id,
        _ref
      },
      alt
    },
    author->{
      name
    }
  }
`