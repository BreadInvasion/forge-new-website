import { api, publicApi } from "./configs/axiosConfigs";

export const OmniAPI = {
    getAll: async (type: string) => {
        const response = await api.request({
            url: `/${type}?limit=200`,
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
            url: `/${type}/${id}?limit=200`,
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
            url: `/${type}/${id}?limit=200`,
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
            url: `/${type}/${id}?limit=200`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });

        return response.data;
    },
    clear: async (id: string) => {
        const response = await api.request({
            url: `/clear/${id}?limit=200`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });

        return response.data;
    },
    use: async (machine_id: string, data: Record<string, any>) => {
        const response = await api.request({
            url: `/use/${machine_id}?limit=200`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            data: data,
        });

        return response.data;
    },
    fail: async (machine_id: string) => {
        const response = await api.request({
            url: `/fail/${machine_id}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });

        return response.data;
    },
    getPublic: async (type: string) => {
        const response = await publicApi.request({
            url: `/${type}?limit=200`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    }
};