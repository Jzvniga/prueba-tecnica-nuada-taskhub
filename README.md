# 🚀 Prueba Técnica: Task Hub (Full-Stack MERN + Python/MCP)

Desarrollado por: **José I. Zúñiga Osores** 
Fecha: **Octubre 2025**

Implementación del "Task Hub", un sistema full-stack que incluye una API REST (Node.js/Express + MongoDB), un Front-end reactivo (React + React Query) y un script de análisis en Python, con enfoque en la orquestación de Agentes de IA (MCP).

## 1. Instrucciones de Ejecución

Para levantar el proyecto, siga los siguientes pasos desde el directorio raíz (`PRUEBATECNICANUADAAI`):

### 1.1. Backend (API REST)

1.  **Variables de Entorno:** Cree el archivo `.env` en la carpeta `/backend` con la siguiente variable:
    ```
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/taskhub_db 
    ```
2.  **Dependencias:** Instale Node.js y luego las dependencias:
    ```bash
    cd backend
    npm install
    ```
3.  **Ejecución:** Asegúrese de que MongoDB esté corriendo y luego inicie el servidor:
    ```bash
    npm run dev
    ```
    *API disponible en: `http://localhost:3000`*

### 1.2. Front-end (React)

1.  **Dependencias:** Instale Node.js y las dependencias (React Query, Lodash, Axios):
    ```bash
    cd frontend
    npm install
    ```
2.  **Ejecución:** Inicie la aplicación:
    ```bash
    npm run dev
    ```
    *Frontend disponible en: `http://localhost:5173`*

### 1.3. Script Python (Análisis)

1.  **Dependencias:** Instale Python 3.10+ y las librerías necesarias:
    ```bash
    cd analysis
    pip install requests python-dateutil
    ```
2.  **Ejecución:** Ejecute el script (el Backend debe estar corriendo):
    ```bash
    python analyze_tasks.py
    ```
    *(Esto imprimirá el Total de Tareas y el Próximo Vencimiento en la consola).*

---

## 2. Decisiones Técnicas Clave

### Stack MERN & Calidad de Código
* **Gestión de Estado:** Se utilizó **React Query (TanStack Query)** para manejar el estado del servidor (`tasks`). Esto asegura *caching* automático, manejo de estados `loading/error`, y simplifica la invalidación (refetching) de la lista después de crear una tarea.
* **Búsqueda UX:** La búsqueda en tiempo real implementa **`debounce` de 300ms** utilizando Lodash. Esto optimiza el uso de recursos al evitar peticiones a la API en cada pulsación de tecla.
* **Estructura del Backend:** Implementación de controladores (`taskController.js`) y rutas (`taskRoutes.js`) para una estructura escalable y clara.
* **Filtrado en MongoDB:** Se utiliza la consulta `$regex` con la opción `i` (`case-insensitive`) para cumplir con el requisito de búsqueda de subcadenas.

### Integración Python
* Se utiliza la librería **`requests`** para la comunicación HTTP y **`python-dateutil`** para el *parsing* robusto de fechas ISO 8601, lo cual es necesario para calcular el próximo vencimiento (`due`) en el futuro.

---

## 3. Limitaciones Conocidas y Pasos Futuros

* **Autenticación:** El proyecto es solo la funcionalidad de la tarea. No incluye autenticación (OAuth/JWT), que sería la primera adición en un entorno de producción.
* **Paginación:** El endpoint `GET /api/tasks` no implementa paginación; devuelve todas las tareas. Esto debería optimizarse si la cantidad de datos creciera.
* **Testing:** Solo se verificó la funcionalidad manual (Postman/Navegador). Faltan pruebas unitarias y de integración (Jest/Supertest/RTL).

---

## 4. Bonus Implementados (Para Destacar)

| Opción | Descripción | Instrucciones |
| :--- | :--- | :--- |
| **3. Integración MCP/Agents** | **Implementado.** Diseño del contrato JSON Schema para el Agente de IA. | Ver archivo `mcp-tool.json` en la raíz del proyecto. |

**Explicación del Bonus MCP (Model Context Protocol):**
El archivo `mcp-tool.json` expone la funcionalidad `create_task`. Esto permite a un Agente de IA (orquestado por LangChain o un framework similar) mapear la intención del usuario (ej., "Recuérdame pagar la cuenta mañana") a una llamada a nuestra API (`POST /api/tasks`), demostrando la integración con el protocolo de IA requerido.

***