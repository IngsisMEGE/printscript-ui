import axios, {AxiosInstance} from 'axios';

export type Language =
    "Printscript" |
    "Java"|
    "Python"|
    "Go"


export class executionRequests {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'http://20.197.251.215',
        });

        const jwt = localStorage.getItem("jwt") ?? "";

        this.axiosInstance.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${jwt}`;
            return config;
        });
    }

    async executeSnippet(id: string, inputs: string[], language: string) {
        const url = `/execute/live`;
        return await this.axiosInstance.post(url, {snippetId: id, inputs, language});
    }
}

