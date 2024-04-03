import { JSDOM } from 'jsdom';
import { ElementorElement, ElementorTemplate } from './interfaces';

const html = `
<section id="hero" class="py-10 md:py-20">
    <div class="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div class="hero-content max-w-lg">
            <h1 class="hero-title text-4xl md:text-5xl font-bold mb-4">Bienvenido a Sabrocito</h1>
            <p class="hero-description text-lg md:text-xl mb-4">Saborea la mejor variedad de hamburguesas en el
                restaurante más popular de Lima, ubicado en el centro de la ciudad.</p>
            <a href="#reservas"
                class="btn btn-primary inline-block bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold transition duration-300 hover:bg-blue-700">Reserva
                ahora</a>
        </div>
        <div class="w-[350px] h-80">
            <img src="https://res.cloudinary.com/dqwojznyw/image/upload/v1712160629/LANDING-AI/qw9gp1f7s9yatfkamna9.png"
                alt="Imagen de hamburguesa deliciosa en Sabrocito, el restaurante de comida rápida más popular de Lima"
                class="object-cover h-full w-full rounded-lg">
        </div>
    </div>
</section>
`
export const convertToElementorStructure = (element: Element): ElementorElement => {
    const elementorElement: ElementorElement = {
        id: generateUniqueId(), // Generar un ID único para el elemento
        settings: {}, // Inicializar los ajustes del elemento
        elements: [] // Inicializar los elementos hijos del elemento
        ,
    };

    // Obtener información de los atributos del elemento
    const attributes: { [key: string]: string } = {};
    for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i];
        attributes[attribute.nodeName] = attribute.nodeValue ?? '';
    }
    elementorElement.settings = attributes;

    // Obtener información de los elementos hijos
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        const childElementor = convertToElementorStructure(child);
        elementorElement.elements.push(childElementor);
    }

    return elementorElement;
};


// Función para generar un ID único (puedes implementarla según tus necesidades)
const generateUniqueId = (): string => {
    // Implementación para generar un ID único (ejemplo)
    return 'elementor-' + Math.random().toString(36).substr(2, 9);
};

export const convertToElementor = async () => {

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const section = document.getElementById('hero')

    if(!section) return

    const content = convertToElementorStructure(section);

    const template: ElementorTemplate = {
        content: [content],
        page_settings: {}, // Puedes incluir aquí las configuraciones de la página si es necesario
        version: "0.4", // Puedes establecer la versión que desees
        title: 'Prueba',
        type: "page" // Puedes especificar el tipo de plantilla (página, sección, etc.)
    };


    return template
}