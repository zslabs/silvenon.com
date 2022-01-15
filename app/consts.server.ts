import path from 'path'

export const ROOT_DIR = path.join(__dirname, '../../../..')
export const POSTS_DIR = path.join(
  ROOT_DIR,
  process.env.NODE_ENV === 'development' ? 'app/posts' : 'posts',
)
export const THEMES_DIR = path.join(
  ROOT_DIR,
  process.env.NODE_ENV === 'development' ? 'app/themes' : 'themes',
)
