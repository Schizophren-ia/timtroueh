import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
mkdirSync('outputs', {recursive:true});
await build({entryPoints:['lib/server.ts'],outfile:'outputs/api-under-test.mjs',bundle:true,platform:'node',format:'esm',packages:'external'});
