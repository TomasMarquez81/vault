import {
    MLCEngineWorkerHandler, // Importar el manejador de workers del motor MLC
    MLCEngine, // Importar el motor MLC
} from "https://esm.run/@mlc-ai/web-llm";

// Crear una nueva instancia del motor MLCEngine
const engine = new MLCEngine();

// Crear un manejador para el worker del motor MLCEngine
const handler = new MLCEngineWorkerHandler(engine);

// Función para manejar los mensajes recibidos por el worker
onmessage = (msg) => {
    // Pasar el mensaje recibido al manejador del motor
    handler.onmessage(msg);
};
