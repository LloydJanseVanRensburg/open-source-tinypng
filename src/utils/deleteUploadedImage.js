import { unlink } from 'node:fs/promises';

export default function deleteUploadedImage(filePath) {
    return unlink(filePath);
}
