import {SimpleChatEngine} from "./chat-engine/simple.js";
import {LLMChatEngine}    from "./chat-engine/llm.js";
import MarkdownIt         from "https://unpkg.com/markdown-it@15.0.2/dist/browser/markdown-it.esm.min.mjs";

/**
 * Warten, bis die Seite komplett geladen wurde und dann erst die Initialisierungen
 * im JavaScript vornehmen. Sonst funktionieren die DOM-Zugriffe nicht.
 */
window.addEventListener("DOMContentLoaded", () => {
    // Wichtige HTML-Elemente besorgen
    let messagesElement = document.querySelector("#chat-area .messages");
    let inputElement = document.querySelector("#chat-area input");

    document.querySelector("html").addEventListener("click", () => inputElement.focus());

    // Aktuell aktive Chat Engine
    let engine = null;
    let md = new MarkdownIt();

    /**
     * Hilfsfunktion zur Ausgabe einer Chatnachricht.
     *
     * @param {Boolean} user true = Benutzer, false = Chatbot
     * @param {String} message Text der Chatnachricht
     */
    function postMessage(user, message) {
        let divElement = document.createElement("div");
        divElement.classList.add("message");
        divElement.classList.add(user ? "user" : "bot");
        divElement.innerHTML = md.render(message);

        messagesElement.appendChild(divElement);
        messagesElement.scrollTop = messagesElement.scrollHeight;

        return divElement;
    }

    // Startnachricht anzeigen
    postMessage(false, "Bitte Chat Engine auswählen:\n\n - `*simple` = Einfache Chat Engine\n - `*llm` = Generatives Sprachmodell\n");

    /**
     * Nachricht bei ENTER abschicken und Antwort vom Chatbot generieren.
     */
    inputElement.addEventListener("keyup", async event => {
        if (event.key == "Enter") {
            // Benutzernachricht anzeigen
            let userMessage = event.target.value;
            postMessage(true, userMessage);

            // Eingabefeld leeren
            event.target.value = "";
            event.target.disabled = true;

            // Antwortnachricht erzeugen und anzeigen
            let answerDiv = postMessage(false, "");

            let callback = text => {
                answerDiv.innerHTML = md.render(text);
                messagesElement.scrollTop = messagesElement.scrollHeight;
            }

            switch (userMessage.toUpperCase()) {
                case "*SIMPLE":
                    engine = new SimpleChatEngine();
                    await engine.init(callback);
                    break;
                case "*LLM":
                    engine = new LLMChatEngine();
                    await engine.init(callback);
                    break;
                default:
                    if (engine) {
                        await engine.generateBotAnswer(userMessage, callback);
                    } else {
                        callback("Keine Chat Engine geladen!");
                    }
            }

            // Eingabefeld wieder aktivieren
            event.target.disabled = false;
            event.target.focus();
        }
    });
});
