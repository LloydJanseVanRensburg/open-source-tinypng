import {rm} from 'node:fs/promises'
import createDir from "./createDir.js";

export default async function clearDir(dirPath) {
    await rm(dirPath, { force: true, recursive: true });
    return createDir(dirPath);
}
