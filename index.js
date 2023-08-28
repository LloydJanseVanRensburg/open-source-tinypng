import path from 'path';
import express from 'express';
import morgan from 'morgan';
import multer from 'multer';
import fileDirName from "./utils/dirname.js";
import reduceImageSize from "./utils/image-reducer.js";
import deleteUploadedImage from "./utils/deleteUploadedImage.js";

const { __dirname } = fileDirName(import.meta);

const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    const HTMLFilePath = path.join(__dirname, 'views', 'home.html')
    return res.sendFile(HTMLFilePath);
})

app.post('/reduce-images', upload.array('files'), async (req, res) => {
    const files = req.files;

    console.log(files);

    const downloadLinks = [];
    const asyncOperations = [];

    try {
        for (const file of files) {
            const { filename, originalname } = file;
            const uploadedFilePath = path.join(__dirname, 'uploads', filename);

            await reduceImageSize(uploadedFilePath, originalname);
            await deleteUploadedImage(uploadedFilePath);

            downloadLinks.push(`/download/${originalname}`)
        }

        return res.send({ success: 'true', downloads: downloadLinks });
    } catch (e) {
        return res.status(500).send({ success: 'false', error: e })
    }
});

app.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'outputs', filename);

    res.download(filePath, (e) => {
        if(e) {
            console.error(e);
            res.status(500).send('Error downloading file');
        }
    })
});

app.listen('3000', () => {
    console.log('Server running on port 3000');
});
