import { unlink } from 'node:fs/promises';

export default async function deleteUploadedImage(filePath) {
    return await unlink(filePath);
}
