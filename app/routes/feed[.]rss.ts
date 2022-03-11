import { LoaderFunction } from 'remix'
import { Feed } from 'feed'
import path from 'path'
import cloudinary from '~/utils/cloudinary'
import { getAllEntries } from '~/utils/posts.server'
import { author } from '~/consts'

export const loader: LoaderFunction = async ({ request }) => {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  if (!host) {
    throw new Error('Could not determine domain URL.')
  }
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const domain = `${protocol}://${host}`

  const feed = new Feed({
    title: `${author.name}'s blog`,
    description: 'A blog about frontend and DX development',
    id: domain,
    link: domain,
    language: 'en-US',
    image: cloudinary('in-reactor-1.jpg', { version: 3 }),
    favicon: `${domain}/favicon.ico`,
    author,
    copyright: '',
  })

  // ???

  const entries = await getAllEntries()

  for (const entry of entries) {
    if ('parts' in entry) {
      const series = entry
      if (!series.published) continue
      for (const part of series.parts) {
        const pathname = `blog/${series.slug}/${part.slug}`
        feed.addItem({
          title: `${series.title}: ${part.title}`,
          id: path.join(domain, pathname),
          link: path.join(domain, pathname),
          description: part.description,
          author: [author],
          date: series.published,
        })
      }
    } else {
      if (!entry.published) continue
      const pathname = `/blog/${entry.slug}`
      feed.addItem({
        title: entry.title,
        id: path.join(domain, pathname),
        link: path.join(domain, pathname),
        description: entry.description,
        author: [author],
        date: entry.published,
      })
    }
  }

  const rssString = feed.rss2()

  return new Response(rssString, {
    headers: {
      'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(rssString)),
    },
  })
}
