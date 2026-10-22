# 🎮 Pokédex - Demo Angular con TypeScript

Aplicación web moderna de Pokédex construida con **Angular 19** y **TypeScript**, consumiendo la [PokéAPI](https://pokeapi.co). Proyecto demo generado por CoderMachine que demuestra capacidades de desarrollo y versionado con arquitectura limpia y estilo retro tipo CRT.

## ✨ Características

- **📱 Responsive**: Diseño adaptable para móviles, tablets y escritorio
- **🎨 Estilo Retro CRT**: Interfaz con efecto de monitor CRT vintage con scanlines sutiles
- **🔍 Búsqueda**: Buscar Pokémon por nombre o ID
- **🏷️ Filtros**: Filtrar por tipo de Pokémon
- **📄 Paginación**: Navegación eficiente por la lista de Pokémon
- **📊 Detalles Completos**: Sprites, tipos, estadísticas con barras visuales, habilidades
- **⚡ Arquitectura Limpia**: Servicios tipados, modelos, componentes standalone
- **🔄 Manejo de Estados**: Loading, errores y estados vacíos
- **💾 Caché**: Sistema de caché en memoria para mejorar rendimiento
- **🎯 Type-safe**: 100% TypeScript con tipado estricto

## 🛠️ Stack Tecnológico

- **Angular 19** (con componentes standalone)
- **TypeScript 5.6**
- **RxJS** para programación reactiva
- **SCSS** para estilos
- **PokéAPI** como fuente de datos
- **Nginx** para servir en producción
- **Docker** para containerización
- **GitHub Actions** para CI/CD

## 📋 Requisitos Previos

- **Node.js** 22.x o superior
- **npm** 10.x o superior
- **Docker** (opcional, para deployment)

## 🚀 Instalación y Desarrollo

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pokemon-demo.git
cd pokemon-demo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm start
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200)

### 4. Build de producción

```bash
npm run build
```

Los archivos compilados estarán en `dist/pokemon-app/browser/`

## 🐳 Deployment con Docker

### Build de la imagen

```bash
docker build -t pokemon-app .
```

### Ejecutar el contenedor

```bash
docker run -d -p 8080:80 pokemon-app
```

La aplicación estará disponible en [http://localhost:8080](http://localhost:8080)

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes de la UI
│   │   ├── pokemon-card/    # Tarjeta de Pokémon
│   │   ├── pokemon-list/    # Lista con búsqueda y filtros
│   │   └── pokemon-detail/  # Vista detallada
│   ├── models/              # Interfaces y tipos TypeScript
│   │   └── pokemon.model.ts
│   ├── services/            # Servicios para lógica de negocio
│   │   └── pokemon.service.ts
│   ├── app.config.ts        # Configuración de la app
│   ├── app.routes.ts        # Definición de rutas
│   └── app.ts               # Componente raíz
├── styles.scss              # Estilos globales (tema CRT)
└── index.html               # HTML principal
```

## 🎨 Características de Diseño

- **Paleta de colores**: Verde neón (#00ff00) y cyan (#00ffff) sobre fondo negro
- **Tipografía**: "Press Start 2P" para títulos (estilo pixel art) y "Courier New" para contenido
- **Efectos CRT**: Scanlines animadas sutiles y efecto de tubo de rayos catódicos
- **Colores de tipos**: Cada tipo de Pokémon tiene su color característico
- **Animaciones**: Transiciones suaves y efectos hover con glow

## 🧪 Comandos Disponibles

```bash
npm start          # Servidor de desarrollo en puerto 4200
npm run build      # Build de producción
npm run watch      # Build en modo watch
npm test           # Ejecutar tests unitarios
npm run lint       # Verificar código con ESLint
```

## 🌐 Deploy a GitHub Pages

El proyecto incluye un workflow de GitHub Actions que automáticamente:

1. Instala dependencias
2. Ejecuta el build
3. Despliega a GitHub Pages (en push a `main`)

Para habilitar GitHub Pages:

1. Ve a **Settings** → **Pages** en tu repositorio
2. En **Source**, selecciona **GitHub Actions**
3. Haz push a la rama `main`

La aplicación estará disponible en: `https://tu-usuario.github.io/pokemon-demo/`

## 🔧 Configuración para Servidor Ubuntu

### 1. Instalar Docker

```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Build y deploy

```bash
# Clonar el repo
git clone https://github.com/tu-usuario/pokemon-demo.git
cd pokemon-demo

# Build de la imagen
sudo docker build -t pokemon-app .

# Ejecutar
sudo docker run -d -p 80:80 --name pokemon-app pokemon-app
```

### 3. Configurar como servicio systemd (opcional)

Crear archivo `/etc/systemd/system/pokemon-app.service`:

```ini
[Unit]
Description=Pokemon App
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker start -a pokemon-app
ExecStop=/usr/bin/docker stop pokemon-app

[Install]
WantedBy=multi-user.target
```

Habilitar el servicio:

```bash
sudo systemctl enable pokemon-app
sudo systemctl start pokemon-app
```

## 📝 Convenciones de Commits

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin afectar código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento
- `build:` Cambios en el sistema de build
- `ci:` Cambios en configuración de CI

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Créditos

- **PokéAPI**: [https://pokeapi.co](https://pokeapi.co)
- **Fuente Press Start 2P**: Google Fonts
- **Framework Angular**: [https://angular.dev](https://angular.dev)

---

Desarrollado con ❤️ por CoderMachine
