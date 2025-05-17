// vercel-build.js - Skip type checking for deployment
import { exec } from 'child_process';

console.log('🚀 Running Vercel build without type checking...');
exec('vite build', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error during build: ${error}`);
        process.exit(1);
    }
    console.log(stdout);
    console.error(stderr);
    console.log('✅ Build completed successfully!');
});
