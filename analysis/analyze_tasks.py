# analysis/analyze_tasks.py
import requests
from dateutil import parser
from datetime import datetime, timezone  # <-- LINEA CRÍTICA 1: Usamos 'timezone'
import sys

# URL de la API de Node.js
API_URL = "http://localhost:3000/api/tasks"

def analyze_tasks():
    """
    Realiza GET a la API, calcula el total de tareas y el próximo vencimiento.
    """
    print("\n--- Nuada AI Task Analysis ---")
    
    try:
        # Realiza GET /api/tasks
        response = requests.get(API_URL)
        response.raise_for_status() 

    except requests.exceptions.RequestException as e:
        print(f" Error de red al conectar con la API ({API_URL}). Asegúrate de que el Backend esté corriendo en el puerto 3000.")
        print(f"Detalle: {e}")
        sys.exit(1)

    try:
        data = response.json()
        tasks = data.get('data', []) 
        
    except requests.exceptions.JSONDecodeError:
        print(" Error: La respuesta de la API no es un JSON válido.")
        sys.exit(1)

    # 1. Total de tareas
    total_tasks = len(tasks)
    print(f"\n Total de tareas: {total_tasks}")

    # 2. Próximo Vencimiento (Lógica)
    # CORRECCIÓN: Usar datetime.now(timezone.utc)
    # ESTA LÍNEA DEBE SER LA 44 en el archivo FINAL:
    now = datetime.now(timezone.utc) 
    
    future_due_dates = []
    
    for task in tasks:
        due_str = task.get('due')
        if due_str:
            try:
                due_date = parser.parse(due_str) 
                
                # Verifica si la fecha está en el futuro
                if due_date > now:
                    future_due_dates.append(due_date)
            except ValueError:
                continue

    if future_due_dates:
        next_due = min(future_due_dates)
        
        # Formatea la salida
        print(f" Próximo vencimiento: {next_due.strftime('%Y-%m-%d %H:%M:%S %Z')}")
    else:
        print(f" Próximo vencimiento: sin fechas programadas")
        
    print("-------------------------------------")

if __name__ == "__main__":
    analyze_tasks()