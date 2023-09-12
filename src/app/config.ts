import { cleanEnv, str, url } from "envalid";

interface Config {
  auth: {
    url: string
    realm: string
    clientId: string
  }
  api: {
    baseUrl: string
  },
  keycloak: {
    id: string
  }
}

const env = cleanEnv(import.meta.env, {
  VITE_KEYCLOAK_URL: url(),
  VITE_KEYCLOAK_REALM: str(),
  VITE_KEYCLOAK_CLIENT_ID: str(),
  VITE_API_BASE_URL: url(),
  VITE_EMPLOYEE_KEYCLOAK_ID: str()
});

const config: Config = {
  auth: {
    url: env.VITE_KEYCLOAK_URL,
    realm: env.VITE_KEYCLOAK_REALM,
    clientId: env.VITE_KEYCLOAK_CLIENT_ID,
  },
  api: {
    baseUrl: env.VITE_API_BASE_URL
  },
  keycloak: {
    id: env.VITE_EMPLOYEE_KEYCLOAK_ID
  }
};

export default config;