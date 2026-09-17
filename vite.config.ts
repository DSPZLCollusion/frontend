import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isNetlify = process.env.NETLIFY === 'true'
const isVercel = process.env.VERCEL === '1'

const config = defineConfig(async () => {
  const plugins = [devtools(), tailwindcss(), tanstackStart(), viteReact()]

  if (isNetlify) {
    const { default: netlify } = await import('@netlify/vite-plugin-tanstack-start')
    plugins.unshift(netlify())
  }

  if (isVercel) {
    const { default: vercel } = await import('@tanstack/vite-plugin-tanstack-start-vercel')
    plugins.unshift(vercel())
  }

  return {
    resolve: { tsconfigPaths: true },
    plugins,
  }
})

export default config
