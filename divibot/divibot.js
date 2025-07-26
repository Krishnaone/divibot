const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// Spotify API configuration
const SPOTIFY_CLIENT_ID = '80e0e3f30ac446d4a20ac2b186fdd044';
const SPOTIFY_REDIRECT_URI = 'https://krishnaone.github.io/divibot';
let spotifyAccessToken = null;

// Spotify authentication
function authenticateSpotify() {
    const scopes = ['user-read-private', 'user-read-email', 'user-modify-playback-state', 'user-read-playback-state'];
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(scopes.join(' '))}`;
    
    window.location.href = authUrl;
}

// Get access token from URL fragment
function getSpotifyToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    
    if (token) {
        spotifyAccessToken = token;
        localStorage.setItem('spotify_token', token);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return token;
    }
    
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('spotify_token');
    if (savedToken) {
        spotifyAccessToken = savedToken;
        return savedToken;
    }
    
    return null;
}

// Search for a song on Spotify
async function searchSpotifySong(songName) {
    if (!spotifyAccessToken) {
        speak("Spotify se connect nahi hai, pehle login karo meri jaan 🎵");
        authenticateSpotify();
        return null;
    }
    
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track&limit=1`, {
            headers: {
                'Authorization': `Bearer ${spotifyAccessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Spotify API request failed');
        }
        
        const data = await response.json();
        return data.tracks.items[0];
    } catch (error) {
        console.error('Error searching Spotify:', error);
        speak("Spotify mein dhundhne mein problem hui, try again karo 💔");
        return null;
    }
}

// Play song on Spotify
async function playSpotifySong(songUri) {
    if (!spotifyAccessToken) {
        speak("Spotify se connect nahi hai, pehle login karo meri jaan 🎵");
        authenticateSpotify();
        return;
    }
    
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${spotifyAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: [songUri]
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to play song');
        }
        
        speak("Song start ho gaya, enjoy karo meri jaan 🎶");
    } catch (error) {
        console.error('Error playing song:', error);
        speak("Song play karne mein problem hui, check karo ki Spotify open hai 💔");
    }
}

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
    
    // Check for Spotify token on page load
    getSpotifyToken();
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
    // Spotify music commands
    else if (message.includes('play') && (message.includes('song') || message.includes('music') || message.includes('spotify'))) {
        const songName = message.replace(/play|song|music|spotify|on|from/gi, '').trim();
        if (songName) {
            speak(`Searching for "${songName}" on Spotify, meri jaan 🎵`);
            searchAndPlaySong(songName);
        } else {
            speak("Kya song play karna chahti ho? Bolo na meri jaan 🎶");
        }
    }
    else if (message.includes('spotify') && message.includes('connect')) {
        speak("Spotify se connect kar raha hoon, meri jaan 🎵");
        authenticateSpotify();
    }
    else {
        speak(`Tumne bola "${message}", chalo dekhte hain internet kya kehta hai 🤓`);
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
    }
}

// Function to search and play song
async function searchAndPlaySong(songName) {
    const song = await searchSpotifySong(songName);
    if (song) {
        speak(`Playing "${song.name}" by ${song.artists[0].name} on Spotify 🎶`);
        await playSpotifySong(song.uri);
    } else {
        speak("Song nahi mila Spotify mein, koi aur try karo meri jaan 💔");
    }
}
