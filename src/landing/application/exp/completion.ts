import path from 'path'
import OpenAI from 'openai'
import { customWriteFile } from '../../../helpers';

const api_key = process.env.API_KEY
const openai = new OpenAI({ apiKey: api_key });



export const LandingContent = {
    hero:{
        title: 'text',
        descripcion: 'text',
        button: 'text',
        img:{
            src: 'text',
            alt: 'text'
        }
    },
    about: {
        title: 'text',
        description:'text',
        img:{
            src: 'text',
            alt: 'text'
        }
    },
    features:{
        title: 'text',
        feauters:{
            features_1:{
                title: 'text',
                description: 'text',
                img:{
                    src: 'text',
                    alt: 'text'
                }
            },
            features_2:{
                title: 'text',
                description: 'text',
                img:{
                    src: 'text',
                    alt: 'text'
                }
            }
        }
    },
    faq:{
        title: 'text',
        questions: {
                question_1: {
                    question: 'text',
                    answer: 'text'
                },
                question_2: {
                    question: 'text',
                    answer: 'text'
                },
                question_3: {
                    question: 'text',
                    answer: 'text'
                },
                question_4: {
                    question: 'text',
                    answer: 'text'
                },
                question_5: {
                    question: 'text',
                    answer: 'text'
                },
        }
    },
    cta:{
        title: 'text',
        descripcion: 'text',
        button: 'text'
    },
    footer:{
        socials:[
            { name: 'text', link: 'text' }
        ]
    }
}

export const completion = async () => {

    const description = "Tengo un gym muy popular en mi ciudad llamado 'Workout Space', el enfoque de mi gym está orientado a entrenar calistenia y pesas, tenemos profesores profesionales del deporte. Nuestras instalaciones son completas, tenemos diferentes espacios para entrenar tranquilamente, tanto al aire libre como bajo techo. Además realizamos competencias cada vez más para unir a nuestra comunidad y atraer a más personas a este maravilloso deporte."

    const SYSTEM_PROMPT = `Eres un experto en la creación de contenido para una landing page. El usuario te proporcionará un objeto que representa todo el contenido que tendrá la landing page y sus secciones, junto con una descripción de su negocio.

    El objeto contendrá todas las secciones de una landing page, con los atributos necesarios, pero los valores estarán vacíos. A través de la descripción del negocio proporcionada por el usuario, debes reemplazar todos estos valores vacíos por el contenido correspondiente en su respectiva sección.
    
    Utiliza la estructura exacta proporcionada por el usuario. Los primeros atributos son las secciones de una landing page, y solo deben incluirse esas secciones, sin agregar nuevas.
    
    Entrega el objeto con el contenido de la landing, sin generar texto adicional o explicaciones.
    
    NO incluyas markdown "\`\`\`" o "\`\`\`json" al principio o al final.
    `

    const USER_PROMPT = `Crea el contenido de mi landing page en este objeto: ${JSON.stringify(LandingContent)}. Esta es la descripcion de mi negocio: ${description}`

    const completion = await openai.chat.completions.create({
        // messages,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: 'user', content: USER_PROMPT }
        ],
        model: 'gpt-3.5-turbo-0125'
    })

    if (!completion) return completion

    const template = completion.choices[0].message.content ?? ''

    const directoryPath = path.join(__dirname, '/')
    customWriteFile({directoryPath, fileName:'template',content: template , mime: 'json'})
    return completion
}