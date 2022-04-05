import { bundleMDX } from 'mdx-bundler'
import { configureRehypePrettyCode } from './rehype-pretty-code'
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist'
import browserslist from 'browserslist'
import esbuildPluginCloudinary from './esbuild-plugin-cloudinary.server'
import remarkSmartypants from 'remark-smartypants'
import remarkUnwrapImages from 'remark-unwrap-images'

export async function bundleMDXPost(content: string) {
  const configuredRehypePrettyCode = configureRehypePrettyCode()

  const { code, errors } = await bundleMDX({
    source: content,
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkSmartypants,
        remarkUnwrapImages,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        configuredRehypePrettyCode,
      ]
      return options
    },
    esbuildOptions: (options) => {
      options.plugins = [
        esbuildPluginBrowserslist(browserslist(), {
          printUnknownTargets: false,
        }),
        esbuildPluginCloudinary,
        ...(options.plugins ?? []),
      ]
      return options
    },
  })

  if (errors.length) {
    throw new Error(errors.join('\n'))
  }

  return code
}
