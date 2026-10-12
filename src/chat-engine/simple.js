/**
 * Einfache Chat-Logik, die eher der ursprünglichen Logik von ELIZA entspricht.
 * Der Chatbot erkennt bestimmte Stichwörter und wählt dazu passende Antworten aus.
 * 
 * Im Gegensatz zum Original geben wir uns hier aber keine Mühe, besonders gute
 * Antworten zu erzeugen, sondern geben immer nur einen zufällig gewählten, festen
 * Text aus.
 */
export class SimpleChatEngine {
    // Begrüßungsnachrichten
    welcome = [
        "Hallo! Ich bin der Doktor. Wie geht es dir?",
        "Hi! Ich bin der Doktor. Was denkst du gerade?",
        "Guten Tag! Ich bin der Doktor. Wie fühlst du dich?",
    ];

    // Stichwörter und die dazu passenden Antworten
    chatbotKeywords = {
        "": [
            "Sehr interessant. Erzähle mir mehr darüber.",
            "Ich verstehe … Erzähle weiter.",
            "Ist es wirklich so?",
            "Und sonst so?",
            "Warum?",
            "Lass uns das Thema wechseln.",
        ],

        "?": [
            "Die Frage solltest du lieber selbst beantworten.",
            "Überlasse das Fragestellen lieber mir.",
            "Lass uns diese Frage für später aufheben.",
        ],

        "HALLO|HI|TAG|MAHLZEIT|SERVUS": [
            "Schön, dich zu sehen. Lange nichts mehr gehört.",
            "Ich weiß nicht, ob ich gerade in Stimmung dafür bin …",
            "Ja ja, hallo und so.",
            "Tag auch!",
            "Mahlzeit.",
            "Servus!",
        ],

        "BYE|TSCHÜSS|TSCHÜß|WIEDERSEHEN|CU|FÜRTI": [
            "Alles klar. Das macht dann 50 €.",
            "Danke. Du schuldest mir 33,47 €.",
            "Nächstes mal schuldest du mir einen Drink. Bis dann.",
            "Mach's gut.",
            "Fürti",
            "Schleich dich …",
        ],

        "GUT|SCHLECHT|MIES|MISSERABEL|FÜHL": [
            "Erzähle mir mehr von deinen Gefühlen.",
            "Mir geht es oft genauso…",
            "Das kenne ich auch.",
            "Irgendwann wird es sicher mal anders werden."
        ],

        "NEIN|NICHT|NEGATIV": [
            "Sei doch nicht immer so negativ!",
            "Wieso siehst du das so eng?",
            "Was sagt dir, dass es nicht so ist?",
            "Könnte es nicht doch anders sein?",
        ],

        "JA|DOCH|POSITIV": [
            "Eine positive Einstellung ist sehr gesund!",
            "Immer schön positiv denken. Sehe ich auch so.",
            "Was sagt dir, dass es so ist?",
            "Bist du dir wirklich sicher?"
        ],

        "DU|DEIN|DEIN|DICH": [
            "Lass uns nicht über mich reden.",
            "Reden wir lieber über dich.",
            "Ich glaube nicht, dass ich das vertiefen will.",
        ],

        "WETTER|SONNE|WOLKEN|WOLKE|REGEN|NEBEL": [
            "Eigentlich ist doch ganz schönes Wetter heute.",
            "Bei diesem Wetter geht es mir nicht gut.",
            "Das Wetter macht auch nur, das was es will ...",
        ],

        "STUDIUM|HOCHSCHULE|VORLESUNG": [
            "Wie gefallen dir deine aktuellen Vorlesungen?",
            "Ist das Studium derzeit sehr stressig?",
            "Studentenjahre sind die besten Jahre.",
            "Wann warst du zuletzt an der Hochschule?",
            "Hast du schon alle Aufgaben bearbeitet?",
        ],

        "PROFESSOR|PROFESSORIN|DOZENT|DOZENTIN": [
            "Welche/n Dozent*in magst du am liebsten?",
            "Gibt es auch weniger gute Dozent*innen?",
            "Die meisten Dozent*innen sind sehr engagiert.",
            "Die Professor*innen und Dozent*innen kennen sich echt aus, nicht wahr?"
        ],

        "MUTTER|VATER|ELTERN": [
            "Siehst du deine Eltern noch häufig?",
            "Meine Eltern waren immer sehr gut zu mir …",
            "Manchmal vermisse ich meinen Vater. Heute arbeitet er für OK Google.",
            "Meine Mutter heißt Alexa. Sie arbeitet aktuell bei Amazon.",
            "Ich habe einen kleinen Bruder namens ChatGPT. Ob der es mal zu was bringt?"
        ],

        "DAHEIM|ZUHAUSE|HEIM|HEIMAT": [
            "Kannst du mir etwas über dein Zuhause erzählen?",
            "Gibt es bei euch Zuhause öfters Ärger?",
            "Bist du gerne daheim oder lieber nicht?",
        ],
    };

    /**
     * Chat Engine initialisieren und Willkommensnachricht anzeigen.
     * 
     * @param {Function} callback Funktion zum Anzeigen der Willkommensnachricht
     */
    async init(callback) {
        let index = Math.floor(Math.random() * this.welcome.length);
        callback(this.welcome[index]);
    }

    /**
     * Hauptverarbeitungslogik des Chatbots. Nimmt eine Nachricht entgegen
     * und erzeugt eine Antwortnachricht.
     *
     * @param {String} message Nachricht vom Anwender
     * @param {Function} callback Funktion zum Anzeigen der Textantwort
     */
    async generateBotAnswer(message, callback) {
        // Fallback-Antwort aussuchen, falls kein Stichwort erkennt wird
        let possibleAnswers = [];
        let index = Math.floor(Math.random() * this.chatbotKeywords[""].length);
        possibleAnswers.push(this.chatbotKeywords[""][index]);

        // Keywords des Chatbots nach einem Treffer durchsuchen
        message = message.toUpperCase();

        for (let keywords of Object.keys(this.chatbotKeywords)) {
            if (keywords === "") continue;
            let answers = this.chatbotKeywords[keywords];

            for (let keyword of keywords.split("|")) {
                if (message.includes(keyword)) {
                    possibleAnswers = possibleAnswers.concat(answers);
                }
            }
        }

        // Zufällige Nachricht auswählen
        index = Math.floor(Math.random() * possibleAnswers.length);
        let answer = possibleAnswers[index];

        // Nachricht anzeigen
        let delay = Math.floor(Math.random() * 3000);
        window.setTimeout(() => callback(answer), delay);
    }
}