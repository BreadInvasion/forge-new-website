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
    verifyEmail: async (token: string) => {
        const response = await authApi.request({
            url: `/email-verification/${token}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        if (response.status != 200) throw response.data;

        return response.data;
    },
    checkEmailToken: async (token: string) => {
        const response = await authApi.request({
            url: `/email-verification/${token}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        if (response.status != 200) throw response.data;

        return response.data;
    },
    makeVerifyToken: async (data: Record<string, any>) => {
        const response = await authApi.request({
            url: "/email-verification",
            method: "POST",
            data,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        if (response.status != 200) throw response.data;

        return response.data;
    },
    makePasswordToken: async (data: Record<string, any>) => {
        const response = await authApi.request({
            url: "/password-verification",
            method: "POST",
            data,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status != 200) throw response.data;

        return response.data;
    },
    checkPasswordToken: async (token: string) => {
        const response = await authApi.request({
            url: `/password-verification/${token}`,
            method: "GET",
        });
        if (response.status != 200) throw response.data;

        return response.data;
    },
    resetPassword: async (token: string, data: Record<string, any>) => {
        const response = await authApi.request({
            url: `/password-verification/${token}`,
            method: "POST",
            data,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status != 200) throw response.data;

        return response.data;
    },
};