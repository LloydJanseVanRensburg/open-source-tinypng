import { createReadStream, createWriteStream, write } from "node:fs";
import archiver from "archiver";
import fileDirName from "./dirname.js";
import { join } from "node:path";
import { v4 } from "uuid";
import clearDir from "./clearDir.js";

/**
 * @description This function will compress the files that has been reduced by sharp, and will give a zip file.
 * @param {{fileName : String, originalName : String}[]} fileLinks 
 */

async function compressFiles(fileLinks, callback) {
    const { __dirname } = fileDirName(import.meta);
    const beforeZipPath = join(__dirname, "..", "..", "beforeZip");
    const downloadFolder = join(__dirname, "..", "..", "outputs");

    const zipName = `${v4()}.zip`;
    const currentZipPath = join(downloadFolder, zipName);

    const writeStream = createWriteStream(currentZipPath);

    const archive = archiver('zip', {
        zlib: { level: 9 }
    });
    archive.pipe(writeStream);

    archive.on('error', function (err) {
        throw err;
    });
    writeStream.on("error", (err) => {
        throw err;
    })

    writeStream.on("close", ()=>{
        clearDir(beforeZipPath);
        callback(zipName);
    })
    for (const currentFile of fileLinks) {
        archive.append(
            createReadStream(join(beforeZipPath, currentFile.fileName)),
            { name: currentFile.originalName }
        );
    };

    await archive.finalize();
}
export default compressFiles;