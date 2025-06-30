// -------------------------------------------------------
// src/lib/api.ts
// -------------------------------------------------------
import axios, { AxiosError } from "axios";

/**
 * 1️⃣  BASE URL
 *    - NEXT.js  : NEXT_PUBLIC_API_BASE_URL
 *    - Vite     : VITE_API_BASE_URL
 *  (N.B. le préfixe NEXT_PUBLIC_ / VITE_ est obligatoire
 *   pour exposer la var côté navigateur)
 */
const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  (process.env.NEXT_PUBLIC_API_BASE_URL as string) ??
  "/api";

/**
 * 2️⃣  Création d’une instance Axios
 */
const api = axios.create({
  baseURL,
  withCredentials: false, // si ton backend pose des cookies (CSRF, session…)
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * 3️⃣  Intercepteur requête
 *    (on peut déjà mettre le token s’il est stocké en localStorage)
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("casavibes_token"); // optionnel
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 4️⃣  Intercepteur réponse
 *    - convertit l’erreur Axios en Error JS lisible
 *    - log console pour debug
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      "Une erreur inconnue est survenue";
    console.error("[API ERROR]", message);
    return Promise.reject(new Error(message));
  }
);

export default api;
