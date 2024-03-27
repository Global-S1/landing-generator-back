import { OpenaiChatResponse } from "../interfaces";

interface Args {
    system_prompt: string,
    user_prompt: string,
    model: Model
}
export type Model = 'gpt-3.5-turbo' | 'gpt-4-0125-preview'

export const chatCompletion = async ({ system_prompt, user_prompt, model }: Args): Promise<OpenaiChatResponse> => {
    const api_key = process.env.API_KEY

    const body = {
        model,
        temperature: 0.4,
        messages: [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ]
    }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api_key}`
        },
        body: JSON.stringify(body)
    })
    const data: OpenaiChatResponse = await resp.json()

    return data
}
