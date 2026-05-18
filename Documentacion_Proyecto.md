# 📋 Gestor de Tareas Full-Stack

Este es un sistema de gestión de tareas desarrollado como proyecto final. Cuenta con un backend con arquitectura REST, persistencia de datos en MySQL, seguridad mediante JSON Web Tokens (JWT) y una interfaz gráfica interactiva y responsiva.

## 🚀 Características
- **Autenticación Segura:** Registro e Inicio de sesión con hashing de contraseñas mediante `bcrypt`.
- **Seguridad (JWT):** Rutas protegidas; los usuarios solo pueden ver, crear y eliminar sus propias tareas.
- **Validación de Datos:** Uso de `express-validator` para asegurar la integridad de la información en el backend.
- **Frontend Integrado:** Interfaz limpia y moderna construida con HTML5, JavaScript asíncrono (`fetch`) y estilizada con **Tailwind CSS**.

## 🛠️ Tecnologías Utilizadas
- **Backend:** Node.js, Express.js
- **Base de Datos:** MySQL
- **Autenticación:** JSON Web Tokens (JWT) y Bcrypt
- **Frontend:** HTML5, JavaScript (Vanilla ES6), Tailwind CSS (CDN)

## 📦 Instalación y Configuración

1. Clonar el repositorio.
2. Instalar las dependencias del backend:
   ```bash
   npm install
