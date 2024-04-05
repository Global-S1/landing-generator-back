import fs from 'fs';
import path from 'path';
import { DataSetFormat } from '../../../interfaces';

export const prepareData = async () => {
    const dataDirectory = path.join(__dirname, '/data/')

    const dataFolderPaths: string[] = []; // /data/data-*

    fs.readdirSync(dataDirectory).forEach(folderName => dataFolderPaths.push(`${dataDirectory}/${folderName}`));

    const dataFiles = fs.readdirSync(dataFolderPaths[0])

    console.log(dataFiles)
    // [ 'hero-t2.json', 'hero.html' ]


    const SYSTEM_PROMPT = 'You are an expert developer'
    let USER_PROMPT = ''
    let ASSISTANT_PROMPT = ''

    await Promise.all(dataFiles.map(async (fileName) => {

        const mime = fileName.split('.')[1]
        console.log(mime)
        const filePath = path.join(dataFolderPaths[0], fileName);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');

        if(mime === 'html'){
            USER_PROMPT = fileContent
        }
        if(mime === 'json'){
            ASSISTANT_PROMPT = fileContent
        }
    }));



    const dataElement: DataSetFormat = {
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: USER_PROMPT },
            { role: 'assistant', content: ASSISTANT_PROMPT }
        ]
    }

    return dataElement
} 