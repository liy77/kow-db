import { promises as fs, constants } from "node:fs";
/**
 * Test whether or not the given path exists by checking with the file system.
 * @param path
 * @returns {Promise<boolean>}
 */
export async function exists(path) {
    try {
        await fs.access(path, constants.W_OK);
        return true;
    }
    catch {
        return Promise.resolve(false);
    }
}
export default {
    ...fs,
    exists
};
