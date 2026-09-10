import { copyFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { pnpm, releasePackages, workspaceRoot } from './package-utils.mjs';

const packageDirectory = process.cwd();
if (!releasePackages.some((name) => packageDirectory === path.join(workspaceRoot, 'packages', name))) {
    throw new Error('Prepack must run inside a publishable workspace package.');
}

// Remove obsolete output as well as the incremental cache before rebuilding.
const outputDirectory = path.join(packageDirectory, 'dist');
await rm(outputDirectory, { recursive: true, force: true });
await copyFile(path.join(workspaceRoot, 'LICENSE'), path.join(packageDirectory, 'LICENSE'));
pnpm(['run', 'build'], packageDirectory);
