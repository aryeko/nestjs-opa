import { promises as fs } from 'fs';
import path from 'path';

async function main() {
  const root = path.resolve(__dirname, '..', '..');
  const dist = path.join(root, 'dist', 'bundle');
  const revision = process.env.BUNDLE_REVISION || 'dev';

  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(dist, { recursive: true });

  // copy policy files
  await fs.cp(path.join(root, 'policy'), dist, { recursive: true });

  // copy data directory if present
  const dataSrc = path.join(root, 'data');
  try {
    await fs.cp(dataSrc, path.join(dist, 'data'), { recursive: true });
  } catch (err: any) {
    if (err.code !== 'ENOENT') throw err;
  }

  const manifest = { revision };
  await fs.writeFile(path.join(dist, '.manifest'), JSON.stringify(manifest, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
