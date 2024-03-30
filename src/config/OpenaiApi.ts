import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config()

const api_key = process.env.API_KEY

export const OpenaiApi = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json'
    }
});
