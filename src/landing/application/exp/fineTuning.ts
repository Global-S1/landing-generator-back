import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'
import { OpenaiApi } from '../../../config'

const trainingFilePath = path.join(__dirname, '/training_file.jsonl')

const api_key = process.env.API_KEY

export const uploadFileOpenai = async () => {

    const openai = new OpenAI({ apiKey: api_key });

    const file = await openai.files.create({
        file: fs.createReadStream(trainingFilePath),
        purpose: "fine-tune",
    });

    return file;
}


export const fineTuning = async () => {

    const training_file_id = 'file-MgGNnlz9lid38A9dunwPC4WU';
    const suffix = 'html-to-elementor';

    const body = {
        training_file: training_file_id,
        model: "gpt-3.5-turbo",
        suffix,
    }

    const resp = await OpenaiApi.post('/fine_tuning/jobs', body);


    return resp.data;
}
