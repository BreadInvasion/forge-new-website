import { api, publicApi } from "./configs/axiosConfigs";

export const OmniAPI = {
    getAll: async (type: string) => {
        const response = await api.request({
            url: `/${type}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });

        return response.data;
    },
    get: async (type: string, id: string) => {
        const response = await api.request({
            url: `/${type}/${id}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });

        return response.data;
    },
    create: async (type: string, data: Record<string, any>) => {
        const response = await api.request({
            url: `/${type}/new`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            data: data,
        });

        return response.data;
    },
    edit: async (type: string, id: string, data: Record<string, any>) => {
        const response = await api.request({
            url: `/${type}/${id}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            data: data,
        });

        return response.data;
    },
    delete: async (type: string, id: string) => {
        const response = await api.request({
            url: `/${type}/${id}`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });

        return response.data;
    },
    getPublic: async (type: string) => {
        const response = await publicApi.request({
            url: `/${type}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    }
};