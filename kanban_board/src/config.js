const config = {
    cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
        region: import.meta.env.VITE_COGNITO_REGION,
    },
    api: {
        invokeUrl: import.meta.env.VITE_API_INVOKE_URL,
    },
};

export default config;