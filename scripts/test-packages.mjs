import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { pnpm, releasePackages, run, workspaceRoot } from './package-utils.mjs';

const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'contrast-lens-packages-'));
const consumerDirectory = path.join(temporaryDirectory, 'consumer');
await cp(path.join(workspaceRoot, 'scripts/package-consumer'), consumerDirectory, { recursive: true });
console.log(`Validating packed packages in ${temporaryDirectory}`);

/** @type {Record<string, string>} */
const archives = {};
const license = await readFile(path.join(workspaceRoot, 'LICENSE'), 'utf8');
for (const directory of releasePackages) {
    const packageDirectory = path.join(workspaceRoot, 'packages', directory);
    const manifest = JSON.parse(await readFile(path.join(packageDirectory, 'package.json'), 'utf8'));
    assert.equal(manifest.private, undefined);
    const archive = path.join(temporaryDirectory, `${directory}.tgz`);
    // This sentinel must be removed by prepack, even though it matches the files allowlist.
    await mkdir(path.join(packageDirectory, 'dist'), { recursive: true });
    await writeFile(path.join(packageDirectory, 'dist/stale-output-probe.js'), 'throw new Error("stale build");');
    pnpm(['pack', '--out', archive], packageDirectory);
    const unpacked = path.join(temporaryDirectory, directory);
    await mkdir(unpacked);
    run('tar', ['-xzf', archive, '-C', unpacked]);
    const packageRoot = path.join(unpacked, 'package');
    const packed = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
    assert.equal(packed.name, manifest.name);
    assert.equal(packed.version, manifest.version);
    assert.equal(packed.license, 'MIT');
    assert.equal(packed.repository.directory, `packages/${directory}`);
    assert.ok((await readFile(path.join(packageRoot, 'README.md'), 'utf8')).startsWith(`# ${manifest.name}`));
    assert.equal(await readFile(path.join(packageRoot, 'LICENSE'), 'utf8'), license);
    assert.doesNotMatch(JSON.stringify(packed), /(?:workspace|catalog|link|file):/);
    const files = await readdir(packageRoot, { recursive: true, withFileTypes: true });
    for (const entry of files.filter((entry) => entry.isFile())) {
        const file = path.relative(packageRoot, path.join(entry.parentPath, entry.name)).replace(/\\/g, '/');
        assert.match(
            file,
            /^(?:package\.json|README\.md|LICENSE|CHANGELOG\.md|preset\.js|dist\/.+\.(?:js|js\.map|d\.ts))$/,
        );
        assert.doesNotMatch(file, /(?:tsbuildinfo|stale-output-probe|test-utils|\.test\.|\.stories\.|\.fixture\.)/);
        if (file.endsWith('.js.map')) {
            const map = JSON.parse(await readFile(path.join(packageRoot, file), 'utf8'));
            assert.ok(map.sourcesContent?.length, `${file} must include its original source`);
        }
    }
    /** @param {unknown} target */
    async function checkExport(target) {
        if (typeof target === 'string') await readFile(path.join(packageRoot, target));
        else if (target && typeof target === 'object') {
            for (const value of Object.values(target)) await checkExport(value);
        }
    }
    await checkExport(packed.exports);
    archives[manifest.name] = `file:${archive.replace(/\\/g, '/')}`;
    console.log(`Verified contents of ${manifest.name}@${manifest.version}`);
}

const require = createRequire(path.join(workspaceRoot, 'package.json'));
const storybookRequire = createRequire(path.join(workspaceRoot, 'packages/test-storybook/package.json'));
const jestRequire = createRequire(path.join(workspaceRoot, 'packages/test-jest/package.json'));
/** @param {string} name @param {NodeJS.Require} resolveFrom */
function installedVersion(name, resolveFrom = require) {
    return resolveFrom(`${name}/package.json`).version;
}
const dependencies = {
    ...archives,
    '@types/node': installedVersion('@types/node'),
    '@storybook/react-vite': installedVersion('@storybook/react-vite'),
    storybook: installedVersion('storybook'),
    react: installedVersion('react', storybookRequire),
    'react-dom': installedVersion('react-dom', storybookRequire),
    '@types/react': installedVersion('@types/react', storybookRequire),
    '@types/react-dom': installedVersion('@types/react-dom', storybookRequire),
    jest: installedVersion('jest', jestRequire),
    '@jest/globals': installedVersion('jest', jestRequire),
    expect: installedVersion('jest', jestRequire),
    'jest-environment-jsdom': installedVersion('jest-environment-jsdom', jestRequire),
    playwright: installedVersion('playwright', storybookRequire),
    typescript: installedVersion('typescript'),
};
await writeFile(
    path.join(consumerDirectory, 'package.json'),
    JSON.stringify({
        name: 'packed-consumer',
        private: true,
        type: 'module',
        packageManager: require('./package.json').packageManager,
        dependencies,
    }),
);
// Override transitive workspace dependencies so every internal import uses the archives under test.
await writeFile(
    path.join(consumerDirectory, 'pnpm-workspace.yaml'),
    `overrides: ${JSON.stringify(archives)}\nallowBuilds:\n  '@parcel/watcher': true\n  esbuild: true\n  unrs-resolver: true\n`,
);
await mkdir(path.join(consumerDirectory, '.storybook'));
await writeFile(
    path.join(consumerDirectory, '.storybook/main.mjs'),
    `export default { framework: '@storybook/react-vite', stories: ['../*.stories.jsx'], addons: ['@contrast-lens/storybook-addon/preset.js'] };\n`,
);
await writeFile(
    path.join(consumerDirectory, 'jest.config.mjs'),
    `export default { testEnvironment: 'jsdom', transform: {}, testMatch: ['**/consumer.test.mjs'] };\n`,
);
await writeFile(
    path.join(consumerDirectory, 'tsconfig.json'),
    JSON.stringify({
        compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            strict: true,
            noEmit: true,
            skipLibCheck: false,
            types: ['node', 'react'],
        },
        include: ['types.ts'],
    }),
);
pnpm(['install', '--prefer-offline'], consumerDirectory);
for (const name of Object.keys(archives)) {
    assert.ok(
        !(await realpath(path.join(consumerDirectory, 'node_modules', name))).startsWith(workspaceRoot),
        'Consumer must not resolve workspace source',
    );
}
pnpm(['exec', 'tsc', '-p', '.'], consumerDirectory);
const originalNodeOptions = process.env.NODE_OPTIONS;
process.env.NODE_OPTIONS = `${originalNodeOptions ?? ''} --experimental-vm-modules`.trim();
try {
    pnpm(['exec', 'jest', '--config', 'jest.config.mjs', '--runInBand'], consumerDirectory);
} finally {
    if (originalNodeOptions === undefined) delete process.env.NODE_OPTIONS;
    else process.env.NODE_OPTIONS = originalNodeOptions;
}
pnpm(['exec', 'storybook', 'build', '--disable-telemetry'], consumerDirectory);
run(process.execPath, ['storybook.mjs'], consumerDirectory);
console.log(`All packed package checks passed. Archives and consumer retained at ${temporaryDirectory}`);
