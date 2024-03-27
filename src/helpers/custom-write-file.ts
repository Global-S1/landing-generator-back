import fs from 'fs'
import path from 'path'

interface Args {
    directoryPath: string;
    fileName: string;
    content: string;
    mime: string
}

export const customWriteFile = ({ directoryPath, fileName, content, mime }: Args) => {
    const date = new Date().toLocaleDateString().split('/').join('-')
    const time = new Date().toLocaleTimeString().split(':').slice(0, 2).join('-')
    const filePath = path.join(directoryPath, `${fileName}_${date + '_' + time}.${mime}`)

    switch (mime) {
        case 'json':
            // La respuesta json de OpenAI viene en string  
            // El respuesta de API de figma es devuelto como un objeto
            const contentParse = (typeof content === 'string') ? JSON.parse(content ?? '{}') : content
            fs.writeFileSync(filePath, JSON.stringify(contentParse, null, 2));

            break;
        case 'html':
            fs.writeFileSync(filePath, content);

            break;
    }

    return filePath
}