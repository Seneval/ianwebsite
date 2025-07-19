# Blog de iAN - Inteligencia Artificial para Negocios

## Estructura del Blog

```
blog/
├── index.html          # Página principal del blog con listado de posts
├── admin.html          # Panel de administración (solo para ti)
├── posts/              # Carpeta con todos los artículos
│   └── *.html         # Archivos individuales de cada post
├── assets/             # Imágenes y recursos del blog
└── css/               # Estilos específicos del blog
    └── blog-post.css  # Estilos para los posts individuales
```

## Cómo agregar un nuevo post

### Opción 1: Usando el Admin Panel (Recomendado)

1. Ve a `/blog/admin.html` en tu navegador
2. Ingresa la contraseña: `ian2025blog`
3. Completa el formulario con:
   - Título del post
   - URL slug (se genera automáticamente)
   - Resumen (máx 160 caracteres)
   - Categoría
   - Contenido HTML del artículo
   - Keywords SEO
4. Haz clic en "Generar Archivo del Post"
5. Copia el código generado
6. Crea un nuevo archivo en `blog/posts/[slug].html`
7. Pega el código y guarda

### Opción 2: Manualmente

1. Copia un post existente como plantilla
2. Modifica todos los campos necesarios
3. Guarda con el nombre apropiado

## Actualizar el listado de posts

Después de crear un nuevo post, debes actualizar el array en `blog/index.html`:

```javascript
const blogPosts = [
    {
        id: 4, // Incrementa el ID
        title: "Tu nuevo título",
        excerpt: "Resumen del post",
        date: "25 Julio 2025",
        category: "chatbots", // chatbots, desarrollo, prospeccion, tutoriales, casos
        image: "../assets/images/tu-imagen.jpg",
        url: "posts/tu-slug.html",
        readTime: "5 min"
    },
    // ... otros posts
];
```

## SEO Checklist para cada post

- [ ] Título optimizado con keyword principal
- [ ] Meta descripción única (155-160 caracteres)
- [ ] URL amigable con keyword
- [ ] Structured data (Article schema)
- [ ] FAQ schema si aplica
- [ ] Imágenes con alt text descriptivo
- [ ] Enlaces internos a servicios relevantes
- [ ] CTA al final del post
- [ ] Keywords relacionadas en el contenido

## Categorías disponibles

- `chatbots` - Chatbots IA
- `desarrollo` - Desarrollo Web
- `prospeccion` - Prospección Digital
- `tutoriales` - Tutoriales
- `casos` - Casos de Éxito

## Después de publicar

1. Actualiza el `sitemap.xml` con la nueva URL
2. Agrega la URL al script de indexación:
   ```bash
   cd /Users/patricio/Desktop/ian2
   # Edita google_indexing_script.py y agrega la URL
   source indexing_env/bin/activate
   python3 google_indexing_script.py
   ```
3. Haz commit y push a GitHub:
   ```bash
   git add .
   git commit -m "feat: Nuevo post sobre [tema]"
   git push origin main
   ```

## Tips para escribir posts efectivos

1. **Título**: Incluye la keyword principal y hazlo atractivo
2. **Introducción**: Engancha en los primeros 2 párrafos
3. **Estructura**: Usa H2 y H3 para organizar el contenido
4. **Longitud**: Mínimo 800 palabras para mejor SEO
5. **Enlaces**: Incluye links a tus servicios cuando sea relevante
6. **CTA**: Siempre termina con una llamada a la acción
7. **FAQ**: Agrega preguntas frecuentes para featured snippets

## Monitoreo

- Revisa Google Search Console semanalmente
- Monitorea qué posts generan más tráfico
- Actualiza posts antiguos con información nueva
- Responde a comentarios si implementas esa función

## Cambiar contraseña del admin

En `blog/admin.html`, línea ~235:
```javascript
const ADMIN_PASSWORD = 'ian2025blog'; // Cambiar esto
```

---

¡Listo! Ya tienes un blog funcional optimizado para SEO 🚀