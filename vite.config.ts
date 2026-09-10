import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isNetlify = process.env.NETLIFY === 'true'

const config = defineConfig(async () => {
  const plugins = [devtools(), tailwindcss(), tanstackStart(), viteReact()]

  if (isNetlify) {
    const { default: netlify } = await import('@netlify/vite-plugin-tanstack-start')
    plugins.unshift(netlify())
  }

  return {
    resolve: { tsconfigPaths: true },
    plugins,
  }
})

export default config
