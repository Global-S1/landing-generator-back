## Configuracion

Renombrar el archivo `example.env` a `.env` y colocar las siguientes variables de entorno

```
API_KEY= OpenAi api key
PORT=
```

```ts
// secciones que debe tener una plantilla
export type SectionType =
  | "header"
  | "hero"
  | "faq"
  | "features"
  | "pricing"
  | "testimonials"
  | "about"
  | "contact"
  | "cta"
  | "footer";
```
