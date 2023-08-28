
import path from 'path';
import sharp from 'sharp';
import fileDirName from "./dirname.js";

const { __dirname } = fileDirName(import.meta);

export default async function reduceImageSize(filePath, fileName) {
    try {
        const outputFilePath = path.join(__dirname, '..', 'outputs', fileName);

        return await sharp(filePath)
            .resize({ width: 1080, withoutEnlargement: true })
            .toFormat('png').png({ quality: 85 })
            .toFile(outputFilePath);
    } catch (e) {
        console.error(e);
    }
}
