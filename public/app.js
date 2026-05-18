// ========================================================
// 1. CONFIGURACIÓN INICIAL Y CAPTURA DEL DOM
// ========================================================
const API_URL = 'http://localhost:3000/api';

const loginForm = document.getElementById('login-form');
const errorAlerta = document.getElementById('error-alerta');

// Elementos de la pantalla del Dashboard (si existen en la página actual)
const tasksContainer = document.getElementById('tasks-container');
const logoutBtn = document.getElementById('logout-btn');
const taskForm = document.getElementById('task-form');

// ========================================================
// 2. LÓGICA DEL FORMULARIO DE LOGIN
// ========================================================
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // 🔥 Evita que la página se reinicie automáticamente

        // Limpiamos alertas previas
        errorAlerta.classList.add('hidden');
        errorAlerta.innerText = '';

        // Capturamos las credenciales de los inputs
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Petición POST a tu endpoint de autenticación
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Si el backend devuelve 400 o 401, disparamos el error con su mensaje
                throw new Error(data.error || 'Credenciales incorrectas');
            }

            // 🔑 Guardamos el token JWT de forma local en el navegador
            localStorage.setItem('token', data.token);

            // Redirigimos al panel de tareas
            window.location.href = 'dashboard.html';

        } catch (error) {
            // Mostramos el error en el recuadro rojo
            errorAlerta.innerText = error.message;
            errorAlerta.classList.remove('hidden');
        }
    });
}

// ========================================================
// 3. LÓGICA DEL DASHBOARD (CARGAR TAREAS DESDE MYSQL)
// ========================================================
async function cargarTareas() {
    if (!tasksContainer) return;

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const tareas = await response.json();
        tasksContainer.innerHTML = '';

        if (tareas.length === 0) {
            tasksContainer.innerHTML = '<p class="text-gray-500 col-span-2">No tienes tareas pendientes todavía.</p>';
            return;
        }

        tareas.forEach(tarea => {
            const card = document.createElement('div');
            card.className = 'bg-white p-5 rounded-lg shadow border-l-4 border-blue-500 flex flex-col justify-between';
            
            const fecha = tarea.due_date ? new Date(tarea.due_date).toLocaleDateString() : 'Sin fecha';

            // 🌟 CLAVE: Le añadimos el atributo onclick="eliminarTarea(${tarea.id})" al botón
            card.innerHTML = `
                <div>
                    <h3 class="font-bold text-lg text-gray-800">${tarea.title}</h3>
                    <p class="text-gray-600 text-sm my-1">${tarea.description || 'Sin descripción'}</p>
                    <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">📅 ${fecha}</span>
                </div>
                <div class="mt-4 pt-3 border-t flex justify-between items-center">
                    <span class="text-sm font-semibold ${tarea.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}">
                        • ${tarea.status}
                    </span>
                    <button onclick="eliminarTarea(${tarea.id})" class="text-red-500 hover:text-red-700 font-medium text-sm transition duration-150">
                        Eliminar
                    </button>
                </div>
            `;
            tasksContainer.appendChild(card);
        });

    } catch (error) {
        tasksContainer.innerHTML = `<p class="text-red-500 col-span-2">Error al conectar con el servidor: ${error.message}</p>`;
    }
}

// ========================================================
// 4. LÓGICA PARA CREAR UNA NUEVA TAREA (POST)
// ========================================================
if (taskForm) {
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos que la página se recargue

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        // Capturamos los valores de los inputs del formulario
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const due_date = document.getElementById('task-date').value;

        try {
            // Hacemos la petición POST enviando el token en los Headers
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 🛡️ Tu pase de seguridad
                },
                body: JSON.stringify({ title, description, due_date })
            });

            const data = await response.json();

            if (!response.ok) {
                // Si express-validator detecta un error (ej: título muy corto), lo atrapamos aquí
                throw new Error(data.detalles ? data.detalles.join(', ') : data.error);
            }

            // Si todo sale bien, limpiamos el formulario para la próxima tarea
            taskForm.reset();

            // Volvemos a llamar a cargarTareas() para que refresque la lista en vivo
            await cargarTareas();

        } catch (error) {
            // Si falla la validación o el servidor, lo alertamos en pantalla
            alert(`⚠️ Error al crear tarea: ${error.message}`);
        }
    });
}

// ========================================================
// ELIMINAR UNA TAREA (DELETE)
// ========================================================
async function eliminarTarea(id) {
    // Confirmación para evitar accidentes
    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;

    const token = localStorage.getItem('token');
    
    try {
        
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "No se pudo eliminar la tarea");
        }

        // Si el backend respondió éxito, refrescamos la lista en vivo
        await cargarTareas();

    } catch (error) {
        alert(`⚠️ Error: ${error.message}`);
    }
}