import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const workspaceRoot = fileURLToPath(new URL('../', import.meta.url));
export const releasePackages = ['engine', 'jest', 'storybook-addon'];

/** @param {string} command @param {string[]} args @param {string} cwd */
export function run(command, args, cwd = workspaceRoot) {
    const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${command} failed with exit code ${result.status}`);
}

/** @param {string[]} args @param {string} cwd */
export function pnpm(args, cwd = workspaceRoot) {
    const cli = process.env.npm_execpath;
    if (!cli) throw new Error('Run this script through pnpm run.');
    // pnpm may be a JavaScript CLI or a standalone executable on Windows.
    if (/\.[cm]?js$/i.test(cli)) run(process.execPath, [cli, ...args], cwd);
    else run(cli, args, cwd);
}
