import path from 'path';
import express from 'express';
import morgan from 'morgan';
import fileDirName from "./utils/dirname.js";
import checkDirExists from "./utils/checkDirExists.js";
import router from "./routes/index.js";
import clearDir from "./utils/clearDir.js";
import createDir from "./utils/createDir.js";

const { __dirname } = fileDirName(import.meta);
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use('/', router)

app.listen('3000', async () => {
    try {
        const uploadsDirPath = path.join(__dirname, '..', 'uploads');
        const outputsDirPath = path.join(__dirname, '..', 'outputs');

        const hasUploadsDir = await checkDirExists(uploadsDirPath);
        const hasOutputsDir = await checkDirExists(outputsDirPath);

        if (hasUploadsDir) {
            await clearDir(uploadsDirPath);
        } else {
            await createDir(uploadsDirPath);
        }

        if (hasOutputsDir) {
            await clearDir(outputsDirPath);
        } else {
            await createDir(outputsDirPath);
        }

        console.log('Server running on port 3000');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
