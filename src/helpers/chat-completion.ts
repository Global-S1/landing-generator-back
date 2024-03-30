import { OpenaiApi } from "../config";
import { OpenaiChatResponse } from "../interfaces";

interface Args {
    system_prompt: string,
    user_prompt: string,
    model: Model
}
export type Model = 'gpt-3.5-turbo' | 'gpt-4-0125-preview'

export const chatCompletion = async ({ system_prompt, user_prompt, model }: Args): Promise<OpenaiChatResponse> => {

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

    const resp = await OpenaiApi.post<OpenaiChatResponse>('/chat/completions', body)

    const data = resp.data

    return data
}
