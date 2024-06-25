import { CreateWebWorkerMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

// Selección de elementos del DOM utilizando el prefijo $ para indicar que son elementos del DOM
const $ = (el) => document.querySelector(el);
const $form = $("form");
const $input = $("input");
const $template = $("#message-template");
const $messages = $("ul");
const $container = $("main");
const $button = $("button");
const $info = $("small");

// Array para almacenar los mensajes
let messages = [];

// Modelo seleccionado para el motor MLCEngine
const SELECTED_MODEL = "gemma-2b-it-q4f32_1-MLC";

// Creación del motor WebWorkerMLCEngine
const engine = await CreateWebWorkerMLCEngine(
    new Worker(
        "/vault/javascript-100-proyectos/04-Chatgpt-local/js/worker.js",
        { type: "module" }
    ), // Se carga el worker para procesamiento en segundo plano
    SELECTED_MODEL,
    {
        initProgressCallback: (info) => {
            // Callback para actualizar el progreso de inicialización del motor
            $info.textContent = `${info.text}%`;
            if (info.progress === 1) {
                $button.removeAttribute("disabled"); // Habilitar el botón cuando la inicialización está completa
            }
        },
    }
);

// Manejo del evento submit del formulario
$form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    const messageText = $input.value; // Obtener el texto del input
    if (messageText != "") {
        $input.value = ""; // Limpiar el input
    }
    addMessage(messageText, "user"); // Agregar el mensaje del usuario al DOM
    $button.setAttribute("disabled", ""); // Deshabilitar el botón mientras se procesa el mensaje

    const userMessage = {
        role: "user",
        content: messageText,
    };

    messages.push(userMessage); // Agregar el mensaje del usuario al array de mensajes

    // Obtener la respuesta del motor MLCEngine
    const chunks = await engine.chat.completions.create({
        messages,
        stream: true,
    });

    let reply = "";
    const $botMessage = addMessage("", "bot"); // Placeholder para el mensaje del bot

    // Procesar los chunks de la respuesta del motor
    for await (const chunk of chunks) {
        const choice = chunk.choices[0]; // Obtener la primera elección del chunk
        const content = choice?.delta?.content ?? ""; // Obtener el contenido del chunk
        reply += content;
        $botMessage.textContent = reply; // Actualizar el texto del mensaje del bot
    }

    $button.removeAttribute("disabled"); // Habilitar el botón después de recibir la respuesta

    // Agregar la respuesta del bot al array de mensajes
    messages.push({
        role: "assistant",
        content: reply,
    });

    // Actualizar el scroll del contenedor
    $container.scrollTop = $container.scrollHeight;
});

// Función para agregar un mensaje al DOM
function addMessage(text, sender) {
    // Clonar el template del mensaje
    const clonedTemplate = $template.content.cloneNode(true);
    const $newMessage = clonedTemplate.querySelector(".message");
    const $who = $newMessage.querySelector("span");
    const $text = $newMessage.querySelector("p");

    // Configurar el contenido del mensaje
    $text.textContent = text;
    $who.textContent = sender == "bot" ? "GPT" : "Tú";
    $newMessage.classList.add(sender);

    // Agregar el nuevo mensaje al contenedor de mensajes y actualizar el scroll
    $messages.appendChild($newMessage);
    $container.scrollTop = $container.scrollHeight;

    return $text;
}
