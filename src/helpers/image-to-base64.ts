import fs from 'fs';

export const imageToBase64 = (imgPath: string) => {

    const image = fs.readFileSync(imgPath)

    return Buffer.from(image).toString('base64')
}
