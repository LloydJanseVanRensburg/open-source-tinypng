import path from "path";
import reduceImageSize from "../utils/imageReducer.js";
import deleteUploadedImage from "../utils/deleteUploadedImage.js";
import fileDirName from "../utils/dirname.js";
import compressFiles from "../utils/compressFiles.js";


const { __dirname } = fileDirName(import.meta);

export async function getHomePage(req, res) {
    try {
        const HTMLFilePath = path.join(__dirname, '..', 'views', 'home.html')
        return res.sendFile(HTMLFilePath);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Server error' })
    }
}

export async function postReduceImages(req, res) {
    const files = req.files;
    const zipFiles = req.body.zip === 'true' ? true : false;
    const beforeZipLinks = [];
    const asyncOperations = [];

    try {
        for await (const file of files) {
            const { filename, originalname } = file;
            const uploadedFilePath = path.join(__dirname, '..', '..', 'uploads', filename);

            let outputFilePath;

            if (zipFiles) {
                outputFilePath = path.join(__dirname, '..', '..', 'beforeZip', filename);
            } else {
                outputFilePath = path.join(__dirname, '..', '..', 'outputs', originalname);
            }

            await reduceImageSize(uploadedFilePath, outputFilePath);
            await deleteUploadedImage(uploadedFilePath);

            beforeZipLinks.push(
                {
                    fileName: filename,
                    originalName: originalname,
                });

        }

        if (zipFiles) {
            await compressFiles(beforeZipLinks, (download) => {
                return res.send({
                    success: 'true',
                    downloads: [`/download/${download}`]
                });
            });
        } else {
            return res.send({
                success: 'true',
                downloads: beforeZipLinks.map(val => {
                    return `/download/${val.originalName}`;
                })
            })
        }

    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Server error' })
    }
}

export async function getDownloadFileById(req, res) {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '..', '..', 'outputs', filename);

        res.download(filePath, (e) => {
            if (e) {
                console.error(e);
                res.status(500).send('Error downloading file');
            }
        })
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Server error' })
    }
}
