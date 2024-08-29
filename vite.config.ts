import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: [
      'chunk-ZUPEXRDT.js',
      'chunk-WV7PZAWI.js',
      'chunk-MM7CK7RS.js',
      'chunk-5PVOO5DM.js',
      'chunk-KOYK7ZCT.js',
      'chunk-CCYF2KKY.js',
    ],
  },
});
