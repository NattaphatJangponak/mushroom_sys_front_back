import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
 
    server: {
    host: '0.0.0.0',     
    port: 5173           
  }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes('node_modules')) {
//             if (id.includes('react')) return 'react-vendor'
//             if (id.includes('lodash')) return 'lodash-vendor'
//             return 'vendor' // fallback สำหรับ dependency อื่น ๆ
//           }
//         },
//       },
//     },
//     chunkSizeWarningLimit: 1000 // เพิ่ม limit จาก 500kB → 1000kB
//   },
//   server: {
//     host: '0.0.0.0',     
//     port: 5173           
//   }
// })
