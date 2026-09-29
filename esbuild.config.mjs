import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const context = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', 'electron', '@codemirror/*'],
  format: 'cjs',
  target: 'es2021',
  outfile: 'main.js',
  sourcemap: watch ? 'inline' : false,
  minify: !watch,
  logLevel: 'info',
});

if (watch) {
  await context.watch();
} else {
  await context.rebuild();
  await context.dispose();
}
