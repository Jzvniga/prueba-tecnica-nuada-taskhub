import React, { useState, useCallback } from 'react'; // <-- Importa useCallback
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Añadimos useMutation y useQueryClient
import { debounce } from 'lodash'; // <-- 1. Importar debounce de lodash

// URL base de tu API de Node.js
const API_BASE_URL = 'http://localhost:3000/api/tasks';

// -----------------------------------------------------
// Funciones de Petición
// -----------------------------------------------------

const fetchTasks = async (query = '') => {
  const response = await axios.get(`${API_BASE_URL}?q=${query}`);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data.data;
};

const createTaskAPI = async (newTask) => {
  const response = await axios.post(API_BASE_URL, newTask);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data.data;
};

// -----------------------------------------------------
// Componente TaskHub
// -----------------------------------------------------

const TaskHub = () => {
  const queryClient = useQueryClient();
  
  // Estado para lo que el usuario escribe INMEDIATAMENTE (input del campo)
  const [inputSearch, setInputSearch] = useState(''); 
  
  // Estado que se usará para la API (se actualiza solo con debounce)
  const [searchTerm, setSearchTerm] = useState(''); 

  // Función de mutación para crear tareas (la usaremos en el siguiente paso)
  const createMutation = useMutation({
    mutationFn: createTaskAPI,
    onSuccess: () => {
      // Invalida la caché de tareas para que React Query refetch la lista
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
 
  });
  
  // 2. Crear la función debounced usando useCallback
  // Esta función envuelve setSearchTerm con debounce de 300ms
  // Y se envuelve en useCallback para evitar que se cree en cada render.
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300), // <-- El requisito es 300ms
    [] 
  );
  
  // 3. Controlador de cambio que llama al debounced
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputSearch(value); // Actualiza la UI de inmediato
    debouncedSetSearchTerm(value); // Llama a la función debounced
  };


  // 4. useQuery escucha a 'searchTerm' para listar/filtrar
  const { data: tasks, isLoading, isError, error } = useQuery({
    queryKey: ['tasks', searchTerm], 
    queryFn: () => fetchTasks(searchTerm),
    staleTime: 5000, 
  });


  if (isLoading) {
    return <div className="loading-state">Cargando tareas...</div>;
  }

  if (isError) {
    return (
      <div className="error-state">
        Error al cargar las tareas: {error.message}
      </div>
    );
  }


  return (
    <div className="task-hub">
      {/* ------------------------------------------------
        El Formulario de Creación de Tareas irá aquí
        ------------------------------------------------
      */}
      <TaskForm createMutation={createMutation} />


      <h2>Listado de Tareas ({tasks?.length || 0})</h2>

      {/* --- Barra de Búsqueda --- */}
      <input
        type="text"
        placeholder="Buscar por título..."
        value={inputSearch} // Muestra el estado inmediato
        onChange={handleSearchChange} // Usa el handler debounced
        className="search-input"
      />

      {/* --- Lista de Tareas --- */}
      <div className="task-list">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="task-item">
              <p>
                <strong className="task-title">{task.title}</strong>
                {task.due && (
                  <span className="task-due">
                    {' '}
                    (Vence: {new Date(task.due).toLocaleDateString('es-CL')})
                  </span>
                )}
              </p>
              <small>Creada: {new Date(task.createdAt).toLocaleString('es-CL')}</small>
            </div>
          ))
        ) : (
          <p className="no-tasks">No hay tareas para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default TaskHub;


// -----------------------------------------------------
// Componente Formulario (TaskForm)
// -----------------------------------------------------

const TaskForm = ({ createMutation }) => {
    // 1. Estados del formulario
    const [title, setTitle] = useState('');
    const [due, setDue] = useState('');
    const [error, setError] = useState('');
    
    // 2. Manejador de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores anteriores

        // Validación básica del lado del cliente (Requisito)
        if (!title.trim()) {
            setError('El título de la tarea no puede estar vacío.');
            return;
        }

        // Crear el objeto de la nueva tarea
        const newTask = {
            title: title.trim(),
            ...(due && { due: new Date(due).toISOString() }), 
        };
        
        try {
            // Llamar a la mutación para crear la tarea
            await createMutation.mutateAsync(newTask);

            // 3. Limpiar formulario al éxito
            setTitle('');
            setDue('');
        } catch (apiError) {
            // Manejar errores de la API 
            setError(apiError.message || 'Error desconocido al crear la tarea.');
        }
    };

    return (
        <div className="task-form-container">
            <h3>Nueva Tarea</h3>
            <form onSubmit={handleSubmit} className="task-form">
                
                {/* Campo Título (Obligatorio) */}
                <div className="form-group">
                    <label htmlFor="title">Título:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Escribe el título aquí"
                        required
                    />
                </div>
                
                {/* Campo Vencimiento (Opcional) */}
                <div className="form-group">
                    <label htmlFor="due">Fecha de Vencimiento (opcional):</label>
                    <input
                        id="due"
                        type="date"
                        value={due}
                        onChange={(e) => setDue(e.target.value)}
                    />
                </div>
                
                {/* Muestra mensajes de error */}
                {error && <p className="form-error"> {error}</p>}
                
                {/* Muestra estado de carga global de la mutación */}
                <button type="submit" disabled={createMutation.isLoading}>
                    {createMutation.isLoading ? 'Creando...' : 'Crear Tarea'}
                </button>
            </form>
            
            {/* Opcional: Mostrar error de API persistente */}
            {createMutation.isError && (
                 <p className="form-error api-error">
                    API Error: {createMutation.error.message}
                 </p>
            )}
        </div>
    );
};