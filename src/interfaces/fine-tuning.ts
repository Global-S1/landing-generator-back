export interface DataSetFormat{
    messages: DataMessage[]
}
export interface DataMessage{
 role: 'system' | 'user' | 'assistant';
 content: string
}