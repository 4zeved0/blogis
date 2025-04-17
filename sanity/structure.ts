import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) => {
  const manuallyHandled = ['post', 'category', 'comment', 'author']

  return S.list()
    .title('Blog')
    .items([
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('comment').title('Comments'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !manuallyHandled.includes(item.getId()!)
      )
    ])
}
