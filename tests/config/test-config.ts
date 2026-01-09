export const TEST_CONFIG = {
    auth: {
        username: process.env.TEST_USER_NAME || 'consultant',
        password: process.env.TEST_USER_PASSWORD || 'pwd'
    },
    // Hier könnten später auch API-Keys für QA/Staging liegen
    // apiKey: process.env.API_KEY
};
