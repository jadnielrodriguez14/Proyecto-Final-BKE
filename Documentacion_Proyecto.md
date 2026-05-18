# 📋 Sistema Full-Stack de Gestión de Tareas

Este es un sistema web completo (Full-Stack) para la gestión y control de tareas pendientes, desarrollado como proyecto final para la clase de Desarrollo Web Servidor (Web Dev Serv Side). La aplicación implementa una arquitectura de API REST, persistencia de datos en un motor relacional, seguridad por tokens y una interfaz gráfica responsiva.

## 👤 Información del Estudiante
- **Nombre:** Jadniel Rodríguez Viera
- **Institución:** Universidad Interamericana de Puerto Rico, Recinto de Fajardo
- **Curso:** Desarrollo Web del Lado del Servidor

## 🚀 Características del Proyecto
- **Autenticación Segura:** Registro e Inicio de sesión con hashing de contraseñas utilizando la librería `bcrypt`.
- **Seguridad y Control de Accesos:** Rutas del backend protegidas mediante **JSON Web Tokens (JWT)**. Cada usuario autenticado interactúa de forma exclusiva con sus propios datos.
- **Validación robusta:** Implementación de `express-validator` en el backend para asegurar que los campos cumplan con las reglas de negocio (ej. títulos de tareas válidos).
- **Frontend Integrado:** Interfaz dinámica y moderna construida con HTML5, JavaScript asíncrono (`fetch`) y estilizada utilizando clases de **Tailwind CSS**.
- **Operaciones CRUD:** Soporte completo para la creación, lectura y eliminación de tareas en tiempo real.

## 🛠️ Tecnologías Utilizadas
- **Arquitectura de Servidor:** Node.js y Express.js
- **Base de Datos:** MySQL (Conector `mysql2`)
- **Diseño de Interfaz:** Tailwind CSS (vía CDN)
- **Herramientas de Desarrollo:** Visual Studio Code y Git/GitHub

## 📦 Arquitectura de Carpetas
```text
Proyecto-Final/
├── config/          # Conexión a la base de datos MySQL
├── middlewares/     # Protección de rutas mediante JWT
├── routes/          # Endpoints de la API (/api/auth y /api/tasks)
├── public/          # Frontend de la aplicación (Servido por Express)
│   ├── index.html   # Pantalla de Login y Registro
│   ├── dashboard.html # Panel principal de control de tareas
│   └── app.js       # Cerebro de JavaScript (Peticiones Fetch y DOM)
├── .env             # Variables de entorno secretas (Excluido en .gitignore)
├── .gitignore       # Archivos omitidos en el repositorio
├── package.json     # Dependencias y scripts del proyecto
└── server.js        # Punto de entrada de la aplicación
