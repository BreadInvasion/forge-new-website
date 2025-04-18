// src/apis/configs/axiosConfigs.js
import axios from "axios"
import { AuthAPI } from "../AuthAPI";


export const api = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3000/api",
});

export const authApi = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export const publicApi = axios.create({
    baseURL: "http://localhost:3000/api"
});

api.interceptors.request.use(
    async (config) => {
        try {
            const refreshResponse = await AuthAPI.refresh();

            const newToken = refreshResponse.data.access_token;
            const newExpiration = refreshResponse.data.expires_at;

            localStorage.setItem("authToken", newToken);
            localStorage.setItem("token_expiration", newExpiration);

            config.headers.Authorization = `Bearer ${newToken}`;
        } catch (err) {
            console.error("Token refresh failed:", err);
            localStorage.removeItem("authToken");
            localStorage.removeItem("token_expiration");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// defining a custom error handler for all APIs
const errorHandler = (error: { response: { status: any, data: { detail: any } } }) => {
    const statusCode = error.response?.status
    const message = error.response?.data?.detail

    // logging only errors that are not 401
    if (statusCode && statusCode !== 401) {
        console.error(`Error ${statusCode}: ${message}`)
    }

    return Promise.reject(error)
}

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
    return errorHandler(error)
})