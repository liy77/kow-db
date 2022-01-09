import { promises as fs, constants, PathLike } from "node:fs";

/**
 * Test whether or not the given path exists by checking with the file system.
 * @param path 
 * @returns {Promise<boolean>}
 */
export async function exists (path: PathLike): Promise<boolean> {
    try {
        await fs.access(path, constants.W_OK);
        return true;
    } catch {
        return false;
    }
}

export default {
    ...fs,
    exists
}