const { GoogleGenerativeAI } = require("@google/generative-ai");
const { MODELS } = require("./constants");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory cache
const similarityCache = new Map();

// Static semantic map
const skillMap = {
    react: ["next.js", "redux", "react.js", "reactjs", "react-js"],
    node: ["express", "node.js", "nodejs", "node"],
    mongodb: ["mongoose"],
    javascript: ["typescript", "js"],
};

// Normalize
const normalize = (s) => s.toLowerCase().trim();

// Generate symmetric cache key
const getKey = (a, b) => {
    return [a, b].sort().join("|");
};

const isSimilarSkill = async (a, b) => {
    a = normalize(a);
    b = normalize(b);

    // Exact match
    if (a === b) return true;

    // Static map
    if (skillMap[a]?.includes(b) || skillMap[b]?.includes(a)) {
        return true;
    }

    const key = getKey(a, b);

    // Cache check
    if (similarityCache.has(key)) {
        return similarityCache.get(key);
    }

    const prompt = `
    Are these two skills related in software development?
    "${a}" and "${b}"
    Answer ONLY YES or NO.
    `;

    //  Try models in order
    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent(prompt);
            const answer = result.response.text().toLowerCase();

            const isSimilar = answer.includes("yes");

            // Cache result
            similarityCache.set(key, isSimilar);

            return isSimilar;

        } catch (err) {
            if (!err.message.includes("429") && !err.message.includes("404")) {
                console.error("AI error:", err.message);
                break;
            }
        }
    }

    //  Cache fallback result
    similarityCache.set(key, false);

    return false;
};

module.exports = { isSimilarSkill };