# Estudio IA 🧠📚

Plataforma inteligente de apuntes y estudio potenciada por IA con integración de Omniroute para fallback automático entre múltiples modelos de IA.

## ✨ Características

- 📤 **Subida de Documentos**: Soporta PDF, DOCX, TXT, y Markdown
- 🤖 **IA Integrada**: Omniroute con fallback automático entre múltiples proveedores
- 📝 **Resúmenes Inteligentes**: Genera resúmenes automáticos de tus documentos
- ✅ **Tests Automáticos**: Crea preguntas de examen tipo test
- 🎴 **Flashcards**: Genera tarjetas de memoria para repasar
- 💾 **Base de Datos Local**: Todo se guarda en tu navegador con IndexedDB
- 🎨 **Interfaz Moderna**: Diseño responsive con animaciones fluidas

## 🚀 Tecnologías

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Base de Datos**: Dexie (IndexedDB)
- **IA**: Omniroute API
- **Procesamiento**: Mammoth (DOCX), PDF-Parse (PDF)

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/danielpinto201542-cyber/estudio-ia.git
cd estudio-ia
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.local.example .env.local
```

Edita `.env.local` y añade tu API key de Omniroute:
```env
OMNIROUTE_API_KEY=tu_api_key_aqui
OMNIROUTE_ENDPOINT=https://api.omniroute.ai/v1
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔧 Configuración de Omniroute

Omniroute permite usar múltiples proveedores de IA con fallback automático. Para configurarlo:

1. Regístrate en [Omniroute](https://omniroute.ai)
2. Obtén tu API key
3. Configura los modelos que quieres usar (GPT-4, Claude, etc.)
4. El sistema automáticamente usará fallback si un modelo falla

## 📖 Uso

1. **Sube documentos**: Arrastra archivos o haz clic en el área de subida
2. **Selecciona un documento**: Haz clic en cualquier documento de tu lista
3. **Genera contenido con IA**:
   - Resúmenes inteligentes
   - Tests de evaluación
   - Flashcards para repasar

## 🏗️ Estructura del Proyecto

```
estudio-ia/
├── app/
│   ├── api/                 # API Routes
│   │   ├── generate-summary/
│   │   ├── generate-tests/
│   │   └── generate-flashcards/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página principal
│   └── globals.css          # Estilos globales
├── components/
│   ├── FileUploader.tsx     # Componente de subida
│   ├── DocumentList.tsx     # Lista de documentos
│   └── ActionPanel.tsx      # Panel de acciones IA
├── lib/
│   ├── db.ts               # Configuración Dexie
│   ├── omniroute.ts        # Servicio Omniroute
│   └── utils.ts            # Utilidades
└── package.json
```

## 🎯 Próximas Funcionalidades

- [ ] Vista de resúmenes generados
- [ ] Interfaz para hacer tests
- [ ] Sistema de flashcards interactivo
- [ ] Exportar contenido generado
- [ ] Modo oscuro manual
- [ ] Búsqueda en documentos
- [ ] Estadísticas de estudio
- [ ] Categorías y etiquetas
- [ ] Sincronización en la nube

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Daniel Pinto**
- GitHub: [@danielpinto201542-cyber](https://github.com/danielpinto201542-cyber)

## 🙏 Agradecimientos

- [Omniroute](https://omniroute.ai) - Sistema de fallback de IA
- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Estilos
- [Framer Motion](https://www.framer.com/motion/) - Animaciones

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
