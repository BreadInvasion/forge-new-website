import { api, authApi } from "./configs/axiosConfigs";

export const AuthAPI = {
    login: async (username: string, password: string) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        return authApi.post('/login', formData);
    },
    refresh: async () => {
        return authApi.request({
            url: "/refresh",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
    },
    me: async () => {
        return authApi.request({
            url: "/me",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
    },
};