import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: 'http://localhost:5255/openapi/v1.json',
    output: {
      target: 'src/api/api.ts',
      client: 'fetch',
      mode: 'single',
    },
  },
})
