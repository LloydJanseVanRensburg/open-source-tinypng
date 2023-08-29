import sharp from 'sharp';

export default function reduceImageSize(filePath, outputFilePath) {
    return sharp(filePath)
        .resize({ width: 1080, withoutEnlargement: true })
        .toFormat('png').png({ quality: 85 })
        .toFile(outputFilePath);
}
