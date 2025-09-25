// src/aws-config.js
export default {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_POOL_ID, // e.g. ap-south-1_abc123
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID, // e.g. 4xxxxx
      region: import.meta.env.VITE_AWS_REGION, // e.g. ap-south-1
      loginWith: {
        // optional, but recommended
        oauth: {
          domain: `${import.meta.env.VITE_COGNITO_POOL_ID}.auth.${
            import.meta.env.VITE_AWS_REGION
          }.amazoncognito.com`,
          scopes: ["openid", "email", "profile"],
          redirectSignIn: ["http://localhost:5173"],
          redirectSignOut: ["http://localhost:5173"],
          responseType: "code",
        },
      },
    },
  },
};