export const resolveVoiceApiKey = (env = {}) => {
    return env.VITE_VOICE_API_KEY || env.REACT_APP_VOICE_API_KEY || "";
};

export const resolveVoiceLanguage = (env = {}) => {
    return env.VITE_VOICE_LANGUAGE || "es-mx";
};

export const buildVoiceRssAudioUrl = ({ apiKey, text, language = "es-mx" }) => {
    if (!apiKey || !text?.trim()) return null;

    const params = new URLSearchParams({
        key: apiKey,
        b64: "true",
        c: "MP3",
        hl: language,
        src: text.trim()
    });

    return `https://api.voicerss.org/?${params.toString()}`;
};

export const getAudioSourceFromVoiceRssResponse = (responseData) => {
    if (typeof responseData !== "string") return null;

    const trimmed = responseData.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) return trimmed;

    return `data:audio/mpeg;base64,${trimmed}`;
};
