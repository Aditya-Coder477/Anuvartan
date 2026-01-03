const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        // Access the model directly if possible, or use a workaround? 
        // The SDK doesn't have a direct listModels on genAI instance, likely need ModelManager?
        // Wait, version 0.24.1 might differ. 
        // Actually, looking at docs, usually it's not exposed directly on the client in some versions.
        // But let's try assuming standard usage or just try a different model 'gemini-1.5-pro-latest'
        
        // Let's try to check simply by running a curl command if node fails?
        // Or deeper inspection.
        
        // Actually, 404 on `gemini-pro` is very suspicious for a valid key.
        // It implies the endpoint is wrong or the key is completely invalid/wrong type.
        // But 404 Usually "Resource Not Found".
        
    } catch (error) {
    }
}

// Easier: Use fetch/axios to list models via REST API to be sure.
const axios = require('axios');

async function listModelsRaw() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    try {
        console.log("Fetching models from:", url);
        const response = await axios.get(url);
        console.log("Models:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error listing models:");
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
        } else {
            console.log(error.message);
        }
    }
}

listModelsRaw();
