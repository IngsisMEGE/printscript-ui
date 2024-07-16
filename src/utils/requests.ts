import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {SnippetOperations} from "./snippetOperations.ts";
import {ComplianceEnum, CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {TestCaseResult} from "./queries.tsx";
import {FileType} from "../types/FileType.ts";
import {PaginatedUsers} from "./users.ts";

interface SnippetViewDTO {
    id: string
    name: string;
    content: string;
    language: string;
    extension: string;
    compliance: ComplianceEnum;
    author: string;
}

interface SnippetOutputDTO {
    id: number;
    name: string;
    language: string;
    code: string;
    author: string;
    createdAt: Date;
    status: ComplianceEnum;
    extension: string;
}

interface UserDTO {
    id: string;
    name: string;
}

interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export class RealSnippetOperations implements SnippetOperations {
    private readonly API_URL = 'http://20.197.251.215:8081/snippetManager';
    private axiosInstance: AxiosInstance;


    constructor() {
        const jwt = localStorage.getItem("jwt") ?? "";
        this.axiosInstance = axios.create({
            baseURL: this.API_URL,
        });

        this.axiosInstance.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${jwt}`;
            return config;
        });
    }

    async listSnippetDescriptors(page: number, pageSize: number, snippetName?: string): Promise<PaginatedSnippets> {
        const url = `${this.API_URL}/search`;
        const params = { page, pageSize, snippetName };
        console.log(params);
        try {
            const response: AxiosResponse<{ data: SnippetViewDTO[] }> = await this.axiosInstance.post(url, params);

            return {
                page: page,
                page_size: pageSize,
                count: response.data.data.length,
                snippets: response.data.data
            };
        } catch (error) {
            console.error(`Error listing snippets:`, error);
            throw error; // Re-throw the error to propagate it up to the caller
        }
    }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const url = `${this.API_URL}8081/snippetManager/create`;
        try {
            const response: AxiosResponse<SnippetOutputDTO> = await this.axiosInstance.post(url, createSnippet);
            return {
                id: response.data.id.toString(),
                name: response.data.name,
                language: response.data.language,
                content: response.data.code,
                author: response.data.author,
                compliance: response.data.status,
                extension: response.data.extension,
            };
        }
        catch (error) {
            console.error(`Error listing snippets:`, error);
            throw error; // Re-throw the error to propagate it up to the caller
        }
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        const url = `${this.API_URL}8081/snippetManager/get/${id}`;
        try {
            const response: AxiosResponse<SnippetOutputDTO> = await this.axiosInstance.get(url);
            // Explicitly check for successful response status code (usually 200)
            if (response.status === 200) {
                return {
                    name: response.data.name,
                    content: response.data.code,
                    language: response.data.language,
                    extension: response.data.extension,
                    id: response.data.id.toString(),
                    compliance: response.data.status,
                    author: response.data.author,
                };
            } else {
                console.warn(`Request to ${url} returned status code ${response.status}`);
                return undefined;
            }
        } catch (error) {
            console.error(`Error fetching snippet with ID ${id}:`, error);
            return undefined;
        }
    }


    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        const url = `${this.API_URL}8081/snippetManager/edit/${id}`;
        const response: AxiosResponse<SnippetOutputDTO> = await this.axiosInstance.post(url, updateSnippet);
        return {
            name: response.data.name,
            content: response.data.code,
            language: response.data.language,
            extension: response.data.extension,
            id: response.data.id.toString(),
            compliance: response.data.status,
            author: response.data.author,
        };
    }

    async getUserFriends(name?: string, page?: number, pageSize?: number): Promise<PaginatedUsers> {
        const url = `${this.API_URL}8081/user/get`;
        const response: AxiosResponse<Page<UserDTO>> = await this.axiosInstance.get(url, { params: {
            page,
            size: pageSize,
            name
        }});
        return {
            users: response.data.content.map(user => ({
                id: user.id,
                name: user.name,
            })),
            page: response.data.number,
            page_size: response.data.size,
            count: response.data.totalElements,
        };
    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        const url = `${this.API_URL}8081/snippetManager/share/${snippetId}`;
        const response: AxiosResponse<SnippetOutputDTO> = await this.axiosInstance.post(url, { shareEmail: userId });
        return {
            name: response.data.name,
            content: response.data.code,
            language: response.data.language,
            extension: response.data.extension,
            id: response.data.id.toString(),
            compliance: response.data.status,
            author: response.data.author,
        };
    }

    async getFormatRules(): Promise<Rule[]> {
        const rulesFormatUrl = `${this.API_URL}8082/rules/get/user/format`;
        const rulesFormatResponse:AxiosResponse<Rule[]> = await this.axiosInstance.get(rulesFormatUrl);
        return rulesFormatResponse.data
    }

    async getLintingRules(): Promise<Rule[]> {
        const rulesFormatUrl = `${this.API_URL}8082/rules/get/user/lint`;
        const rulesFormatResponse:AxiosResponse<Rule[]> = await this.axiosInstance.get(rulesFormatUrl);
        return rulesFormatResponse.data
    }

    async getTestCases(): Promise<TestCase[]> {
        // Implementación específica dependiendo de cómo se manejen los casos de prueba en tu API
        // Este método debe ser implementado de acuerdo a la lógica de tu API
        throw new Error("Method 'getTestCases' must be implemented");
    }

    async formatSnippet(snippet: string): Promise<string> {
        const rulesFormatUrl = `${this.API_URL}8082/rules/get/user/format`;
        const rulesLintUrl = `${this.API_URL}8082/rules/get/user/lint`;
        const rulesFormatResponse = await this.axiosInstance.get(rulesFormatUrl);
        const rulesLintResponse = await this.axiosInstance.get(rulesLintUrl);
        const url = `${this.API_URL}8081/format/withRules`;
        const response: AxiosResponse<string> = await this.axiosInstance.post(url, {
            snippetId: snippet,
            formatRules: rulesFormatResponse.data,
            lintingRules: rulesLintResponse.data
        });
        return response.data;
    }

    async postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        const url = `${this.API_URL}8083/testManager/save}`;
        const response: AxiosResponse<TestCase> = await this.axiosInstance.post(url, testCase);
        return response.data
    }

    async removeTestCase(id: string): Promise<string> {
        const url = `${this.API_URL}8083/testManager/delete/${id}`;
        const response: AxiosResponse<string> = await this.axiosInstance.post(url);
        return response.data
    }

    async deleteSnippet(id: string): Promise<string> {
        const url = `${this.API_URL}8081/snippetManager/delete/${id}`;
        const response: AxiosResponse<string> = await this.axiosInstance.post(url, {id: id});
        return response.data
    }

    async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        if (testCase){
            return "success"
        }else {
            return "fail"
        }
    }

    async getFileTypes(): Promise<FileType[]> {
        // Implementación específica dependiendo de cómo se manejen los tipos de archivos en tu API
        // Este método debe ser implementado de acuerdo a la lógica de tu API
        throw new Error("Method 'getFileTypes' must be implemented");
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        return newRules
    }

    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        return newRules
    }
}
