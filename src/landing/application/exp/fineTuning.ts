import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'
import { OpenaiApi } from '../../../config'
import { customWriteFile } from '../../../helpers'

const trainingFilePath = path.join(__dirname, '/training_file.jsonl')

const api_key = process.env.API_KEY
const openai = new OpenAI({ apiKey: api_key });

export const uploadFileOpenai = async () => {


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

export const tuneModelCompletion = async (html: string) => {

    const SYSTEM_PROMPT = `You are an expert creating json templates for Elemetor Wordpress.
    The user provildes you eith a styleed HTML section using tailwind and you convert this html to the Elementor template version
    
    - Pay closee attention to each tailwind class in HTML element to adapt these sytle in Elementor template
    - Generate the response without extra text, you will only response the template, and then parse the response and save the json in a file.
    - Do not include markdown "\`\`\`" or "\`\`\`json" at the start or end.`
    
    let USER_PROMPT = html

    const completion = await openai.chat.completions.create({
        // messages,
        messages: [
            { role: "system", content: SYSTEM_PROMPT}, 
            {role: 'user', content: USER_PROMPT}
        ],
        model:'ft:gpt-3.5-turbo-0125:personal:html-to-elementor:9BUkPRp9'
    })

    if(!completion) return completion

    const template = completion.choices[0].message.content ?? ''

    // const directoryPath = path.join(__dirname, '/')
    // customWriteFile({directoryPath, fileName:'template',content: template , mime: 'json'})
    return completion.choices[0]
}