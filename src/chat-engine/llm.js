import {InterruptableStoppingCriteria} from "https://unpkg.com/@huggingface/transformers@4.3.1";
import {TextStreamer}                  from "https://unpkg.com/@huggingface/transformers@4.3.1";
import * as transformers               from "https://unpkg.com/@huggingface/transformers@4.3.1";

/**
 * Chat-Logik auf Basis eines lokal ausgeführten, generativen Sprachmodells.
 * Dies ist entspricht im Kern derselben Technik, die ChatGPT, Claude, Gemini
 * und all den anderen KI-Sprachassistenten zugrunde liegt. Nur, dass das gewählte
 * Modell klein genug ist, um im Browser zu laufen.
 */
export class LLMChatEngine {
    // Geladenes Sprachmodell
    model = null;

    /**
     * Sprachmodell laden und Willkommensnachricht anzeigen.
     * 
     * @param {Function} callback Funktion zum Anzeigen der Willkommensnachricht
     */
    async init(callback) {
        try {
            callback("Lade Sprachmodell. Bitte warten ...");
    
            this.model = await transformers.pipeline("text-generation", "onnx-community/SmolLM2-135M-Instruct-ONNX", {
                dtype: "q4",
                device: "webgpu",
            });
    
            await this.generateBotAnswer("Hi!", callback);
        } catch (error) {
            console.error(error);
            callback(error.message);
        }
    }

    /**
     * Benutzernachricht vom Sprachmodell beantworten lassen.
     *
     * @param {String} message Nachricht vom Anwender
     * @param {Function} callback Funktion zum Anzeigen der Textantwort
     */
    async generateBotAnswer(message, callback) {
        try {
            let answer = "";

            let stop = new InterruptableStoppingCriteria();
            let maxSentences = Math.floor(Math.random() * 3) + 1;
            let numSentences = 0;
            let punctuation = /[.!?]/;

            let handleText = text => {
                if (text.match(punctuation)) {
                    numSentences++;

                    if (numSentences >= maxSentences) {
                        stop.interrupt();
                        text = text.split(punctuation)[0];
                    }
                }

                answer += text;
                callback(answer);
            };

            let streamer = new TextStreamer(this.model.tokenizer, {
                skip_prompt:         true,
                skip_special_tokens: true,
                callback_function:   handleText,
            });
    
            await this.model(message, {
                do_sample:          true,
                temperature:        0.5,
                repetition_penalty: 1.1,
                streamer:           streamer,
                stopping_criteria:  stop,
            });
        } catch (error) {
            console.error(error);
            callback(error.message);
        }
    }
}