import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageManagerCli = process.env.npm_execpath;
const isJavaScriptCli = packageManagerCli ? /\.[cm]?js$/i.test(packageManagerCli) : false;
const packageManagerCommand = isJavaScriptCli
    ? process.execPath
    : (packageManagerCli ?? (process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'));
const useShell = /\.(cmd|bat)$/i.test(packageManagerCommand);
const packageManagerArguments = (args) => (isJavaScriptCli ? [packageManagerCli, ...args] : args);

const initialBuild = spawnSync(
    packageManagerCommand,
    packageManagerArguments(['--prefix', 'packages/storybook-addon', 'run', 'build']),
    {
        cwd: workspaceRoot,
        shell: useShell,
        stdio: 'inherit',
    },
);

if (initialBuild.status !== 0) {
    process.exit(initialBuild.status ?? 1);
}

const processes = [
    spawn(packageManagerCommand, packageManagerArguments(['--prefix', 'packages/storybook-addon', 'run', 'dev']), {
        cwd: workspaceRoot,
        shell: useShell,
        stdio: 'inherit',
    }),
    spawn(packageManagerCommand, packageManagerArguments(['run', 'storybook:serve']), {
        cwd: workspaceRoot,
        shell: useShell,
        stdio: 'inherit',
    }),
];

let stopping = false;

const stop = (exitCode = 0) => {
    if (stopping) {
        return;
    }

    stopping = true;
    for (const child of processes) {
        if (!child.killed) {
            child.kill();
        }
    }
    process.exitCode = exitCode;
};

processes.forEach((child) => {
    child.on('error', (error) => {
        console.error(error);
        stop(1);
    });

    child.on('exit', (code, signal) => {
        if (!stopping) {
            stop(signal ? 1 : (code ?? 0));
        }
    });
});

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
