import { mkdir } from 'node:fs/promises'

export default function createDir(dirPath) {
    return mkdir(dirPath);
}
