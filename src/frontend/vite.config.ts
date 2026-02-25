import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        // Necesario para algunas librerías de React Native y RSocket
        global: 'window',
        'process.env': {},
        Buffer: ['buffer', 'Buffer'],
    },
    resolve: {
        alias: {
            'react-native': 'react-native-web',
        },
        extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.mjs', '.js', '.jsx', '.json', '.cjs', '.ts', '.tsx']
    },
    optimizeDeps: {
        esbuildOptions: {
            resolveExtensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.mjs', '.js', '.jsx', '.json', '.cjs', '.ts', '.tsx']
        }
    }
});
