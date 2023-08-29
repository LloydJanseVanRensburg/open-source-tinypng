import { stat } from 'fs/promises'

export default async function checkDirExists(dirPath) {
    try {
        const stats = await stat(dirPath);
        return !!stats.isDirectory();
    } catch (e) {
        return false;
    }
}
