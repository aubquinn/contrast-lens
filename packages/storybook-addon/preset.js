import { fileURLToPath } from 'node:url';

export function managerEntries(entries = []) {
    return [...entries, fileURLToPath(import.meta.resolve('./dist/manager.js'))];
}
