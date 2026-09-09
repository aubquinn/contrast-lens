import { fileURLToPath } from 'node:url';

/** @param {string[]} entries */
export function managerEntries(entries = []) {
    return [...entries, fileURLToPath(import.meta.resolve('./dist/manager.js'))];
}
