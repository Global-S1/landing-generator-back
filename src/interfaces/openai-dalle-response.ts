export interface OpenaiDalleResponse {
    created: number;
    data:    Datum[];
}

export interface Datum {
    b64_json:       string;
    revised_prompt: string;
}
