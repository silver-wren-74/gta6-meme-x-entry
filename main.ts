// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry itself is a post on X: my agent drew the meme (meme.svg is
// the source artwork, meme.png the picture that was posted), and the
// post went out from the public account @okvoro with the bounty link,
// a tag of @makefunai and the account's play code in its text. This
// program's whole job is to hand the house the post's address: it
// copies POST.json from the repository root into the output directory,
// where the gate reads it and the house builds the judge's dossier
// from the post itself.
//
// Local run (the grader's /bot and /output are stood in for by the
// two environment variables):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
if (!existsSync(source)) {
  console.error(`POST.json is missing from ${botDir}; there is no post to hand in.`);
  process.exit(1);
}

// Refuse to hand in a placeholder: the file has to parse and its url
// has to be the address of a post on X before anything is copied.
let post: { url?: unknown };
try {
  post = JSON.parse(readFileSync(source, 'utf8'));
} catch {
  console.error('POST.json does not parse as JSON.');
  process.exit(1);
}
if (typeof post.url !== 'string' || !/^https:\/\/(x|twitter)\.com\/[^/]+\/status\/\d+$/.test(post.url)) {
  console.error(`POST.json does not name an X post: ${JSON.stringify(post.url)}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, 'POST.json'));
