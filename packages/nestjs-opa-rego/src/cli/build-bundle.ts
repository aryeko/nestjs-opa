import { promises as fs } from 'fs';
import path from 'path';

async function main() {
  const root = path.resolve(__dirname, '..', '..');
  const dist = path.join(root, 'dist', 'bundle');
  const revision = process.env.BUNDLE_REVISION || 'dev';

  await fs.rm(dist, { recursive: true, force: true });
  await fs.mkdir(path.join(dist, 'data'), { recursive: true });

  await fs.copyFile(path.join(root, 'policy', 'authz.rego'), path.join(dist, 'authz.rego'));
  const dataFiles = ['roles.json', 'actionMaps.json'];
  for (const f of dataFiles) {
    await fs.copyFile(path.join(root, 'data', f), path.join(dist, 'data', f));
  }

  const manifest = { revision };
  await fs.writeFile(path.join(dist, '.manifest'), JSON.stringify(manifest, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
