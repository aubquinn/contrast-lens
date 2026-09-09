import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('../', import.meta.url));
const packageRoot = path.join(workspaceRoot, 'packages');
const packageDirectories = (await readdir(packageRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && !entry.isSymbolicLink())
    .map((entry) => path.join(packageRoot, entry.name));

for (const directory of [workspaceRoot, ...packageDirectories]) {
    const entries = await readdir(directory);
    for (const name of entries) {
        if (!['dist', 'coverage', 'storybook-static'].includes(name) && !name.endsWith('.tsbuildinfo')) {
            continue;
        }
        const target = path.resolve(directory, name);
        const relative = path.relative(workspaceRoot, target);
        if (relative.startsWith('..') || path.isAbsolute(relative)) {
            throw new Error(`Refusing to clean outside the workspace: ${target}`);
        }
        await rm(target, { recursive: true, force: true });
    }
}
