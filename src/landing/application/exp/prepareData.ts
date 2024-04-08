import fs from 'fs';
import path from 'path';
import { DataSetFormat } from '../../../interfaces';

const trainingFilePath = path.join(__dirname, '/training_file.jsonl')

export const prepareData = async () => {
    const dataDirectory = path.join(__dirname, '/data/')

    const dataFolderPaths: string[] = []; // /data/data-*

    fs.readdirSync(dataDirectory).forEach(folderName => dataFolderPaths.push(`${dataDirectory}/${folderName}`));

    for (const dataPath of dataFolderPaths) {
        const dataFiles = fs.readdirSync(dataPath)
        // [ 'hero-t2.json', 'hero.html' ]

        const SYSTEM_PROMPT = `You are an expert creating json templates for Elemetor Wordpress.
        The user provildes you eith a styleed HTML section using tailwind and you convert this html to the Elementor template version

        - Pay closee attention to each tailwind class in HTML element to adapt these sytle in Elementor template
        - Generate the response without extra text, you will only response the template, and then parse the response and save the json in a file.
        - Do not include markdown "\`\`\`" or "\`\`\`json" at the start or end.`

        let USER_PROMPT = ''
        let ASSISTANT_PROMPT = ''

        for (const fileName of dataFiles) {
            const filePath = path.join(dataPath, fileName);
            const fileContent = fs.readFileSync(filePath, 'utf-8')

            const mime = fileName.split('.')[1]
            if (mime === 'html') {
                USER_PROMPT = fileContent
            }
            if (mime === 'json') {
                ASSISTANT_PROMPT = fileContent
            }
        }
        const requiredDataFormat: DataSetFormat = {
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: USER_PROMPT },
                { role: 'assistant', content: ASSISTANT_PROMPT }
            ]
        }

        const jsonData = JSON.stringify(requiredDataFormat);
        // Agregar una nueva línea al final del JSON para separar cada dato
        const jsonlData = jsonData + '\n';

        // Escribir la línea JSONL en el archivo
        fs.appendFileSync(trainingFilePath, jsonlData);
    }

    return 'preparing'
}