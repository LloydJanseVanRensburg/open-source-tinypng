import path from "path";
import reduceImageSize from "../utils/imageReducer.js";
import deleteUploadedImage from "../utils/deleteUploadedImage.js";
import fileDirName from "../utils/dirname.js";

const { __dirname } = fileDirName(import.meta);

export async function getHomePage(req, res){
    try {
        const HTMLFilePath = path.join(__dirname, '..', 'views', 'home.html')
        return res.sendFile(HTMLFilePath);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Server error'})
    }
}

export async function postReduceImages(req, res){
    const files = req.files;

    const downloadLinks = [];
    const asyncOperations = [];

    try {
        for (const file of files) {
            const { filename, originalname } = file;
            const uploadedFilePath = path.join(__dirname, '..', '..', 'uploads', filename);
            const outputFilePath = path.join(__dirname, '..', '..', 'outputs', originalname);

            await reduceImageSize(uploadedFilePath, outputFilePath);
            await deleteUploadedImage(uploadedFilePath);

            downloadLinks.push(`/download/${originalname}`)
        }

        return res.send({ success: 'true', downloads: downloadLinks });
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Server error'})
    }
}

export async function getDownloadFileById(req, res) {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '..', '..', 'outputs', filename);

        res.download(filePath, (e) => {
            if(e) {
                console.error(e);
                res.status(500).send('Error downloading file');
            }
        })
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Server error'})
    }
}
