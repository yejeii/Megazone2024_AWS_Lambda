import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      API_URL: 'https://6d0mj8j2t8.execute-api.us-east-1.amazonaws.com/prod'
    }
  },
})
