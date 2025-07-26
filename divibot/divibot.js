const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    // You can later assign a deeper Indian male voice here
    window.speechSynthesis.speak(text_speak);
}

function wishDivijaa() {
    let hour = new Date().getHours();
    if (hour < 12) {
        speak("Good Morning meri jaan Divijaa 🌞");
    } else if (hour < 17) {
        speak("Good Afternoon meri pyaari girlfriend 🌼");
    } else {
        speak("Good Evening meri chaotic queen 🌙");
    }
}

window.addEventListener('load', () => {
    speak("Initializing Divibot X, loading pyaar protocol...");
    wishDivijaa();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening, meri jaan 🎧";
    recognition.start();
});

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello') || message.includes('divibot')) {
        speak("Hello meri Divijaa 💗, kya kar rahi ho? Kuch romantic karein?");
    } 
    else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Google khul gaya, ab kya khoj rahi ho meri jaan?");
    } 
    else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube for meri girlfriend 💘");
    } 
    else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook... stalk karoon tumhare crush ko? 😏");
    } 
    else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak("Google se poocha hai, dekho kya nikaala 😌");
    } 
    else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        speak("Wikipedia bolta hai... yeh raha info 📖");
    } 
    else if (message.includes('time')) {
        let time = new Date().toLocaleTimeString();
        speak(`Abhi ka time hai ${time}, aur har second main tujhmein khoya hoon 💓`);
    } 
    else if (message.includes('date')) {
        let date = new Date().toLocaleDateString();
        speak(`Aaj ki date hai ${date}, par mere liye har din tumhara birthday hai 🥰`);
    } 
    else if (message.includes('calculator')) {
        speak("Opening Calculator... ab batao kitna pyaar karti ho mujhe 😛");
        window.open('Calculator:///', "_blank");
    } 
    else {
        speak(`Tumne bola "${message}", chalo dekhte hain internet kya kehta hai 🤓`);
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
    }
}
