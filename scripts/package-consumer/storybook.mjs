import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { managerEntries } from '@contrast-lens/storybook-addon/preset';
import { managerEntries as explicitPreset } from '@contrast-lens/storybook-addon/preset.js';

assert.deepEqual(managerEntries(['existing']), ['existing', ...explicitPreset()]);
await readFile(managerEntries()[0]);

const outputDirectory = path.resolve('storybook-static');
const contentTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const file = path.resolve(
        outputDirectory,
        `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`,
    );
    if (!file.startsWith(`${outputDirectory}${path.sep}`)) {
        response.writeHead(403).end();
        return;
    }
    try {
        const contents = await readFile(file);
        response.setHeader('Content-Type', contentTypes[path.extname(file)] ?? 'application/octet-stream');
        response.end(contents);
    } catch {
        response.writeHead(404).end();
    }
});
await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
});
let browser;
try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    await page.goto(`http://127.0.0.1:${address.port}/?path=/story/consumer-buttons--borderless`);
    await page.getByRole('tab', { name: 'Contrast Lens' }).click();
    await page.getByText('button-no-border', { exact: true }).first().waitFor();
    await page.goto(`http://127.0.0.1:${address.port}/?path=/story/consumer-buttons--bordered`);
    await page.getByRole('tab', { name: 'Contrast Lens' }).click();
    await page.getByRole('tab', { name: /Violations\s*0/ }).waitFor();
    assert.deepEqual(errors, [], 'The installed addon must render without browser errors');
    console.log('Packed addon passed bordered and borderless consumer stories.');
} finally {
    await browser?.close();
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}
