export interface OpenaiChatResponse {
    id:                 string;
    object:             string;
    created:            number;
    model:              string;
    choices:            Choice[];
    usage:              Usage;
    system_fingerprint: string;
    error?: Error 
}

export interface Choice {
    index:         number;
    message:       Message;
    logprobs:      null;
    finish_reason: string;
}

export interface Message {
    role:    'system' | 'user' | 'assistant';
    content: string;
}

export interface Usage {
    prompt_tokens:     number;
    completion_tokens: number;
    total_tokens:      number;
}
