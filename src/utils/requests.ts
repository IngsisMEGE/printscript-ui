import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {SnippetOperations} from "./snippetOperations.ts";
import {ComplianceEnum, CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "./snippet.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {TestCaseResult} from "./queries.tsx";
import {FileType} from "../types/FileType.ts";
import {PaginatedUsers} from "./users.ts";

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

interface runOutput {
    output: string,
    doesItNeedInput: boolean
}

function mapStringToComplianceEnum(input: string): ComplianceEnum | undefined {
    switch (input.toUpperCase()) {
        case 'PENDING':
            return 'pending';
        case 'FAILED':
            return 'failed';
        case 'NOT-COMPLIANT':
            return 'not-compliant';
        case 'COMPLIANT':
            return 'compliant';
        default:
            return undefined;
    }
}

export class RealSnippetOperations implements SnippetOperations {
    private readonly API_URL = 'http://20.197.251.215';
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
        const url = `${this.API_URL}/snippetManager/snippetManager/search`;
        const params = { page, pageSize };
        if (snippetName) {
            params['snippetName'] = snippetName;
        }
         const response = await this.axiosInstance.post(url, {},{ params: params });

            return {
                page: response.data.pageable.pageNumber,
                page_size: pageSize,
                count: response.data.content.length,
                snippets: response.data.content.map(snippet => ({
                    id: snippet.id.toString(),
                    name: snippet.name,
                    language: snippet.language,
                    author: snippet.author,
                    compliance: mapStringToComplianceEnum(snippet.status)

                })),
            };

    }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const url = `${this.API_URL}/snippetManager/snippetManager/create`;
        try {

            const response = await this.axiosInstance.post(url, {
                name: createSnippet.name,
                language: createSnippet.language,
                code: createSnippet.content,
                extension: createSnippet.extension
            });
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
            throw error;
        }
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        const url = `${this.API_URL}/snippetManager/snippetManager/get/${id}`;
        try {
            const response: AxiosResponse<SnippetOutputDTO> = await this.axiosInstance.get(url);
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
        const url = `${this.API_URL}/snippetManager/snippetManager/edit/${id}`;
        const response: AxiosResponse<SnippetOutputDTO> = await this.axiosInstance.post(url, {code: updateSnippet.content});
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
        const url = `${this.API_URL}/snippetManager/user/get`;
        const response = await this.axiosInstance.get(url, { params: {
            page,
            size: pageSize,
            name
        }});
        return {
            users: response.data.content.map(user => ({
                id: user.email,
                name: user.nickname,
            })),
            page: response.data.number,
            page_size: response.data.size,
            count: response.data.totalElements,
        };
    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        const url = `${this.API_URL}/snippetManager/snippetManager/share/${snippetId}`;
        const response: AxiosResponse<SnippetOutputDTO> = await this.axiosInstance.post(url, {}, { params: {shareEmail: userId}});
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
        const rulesFormatUrl = `${this.API_URL}/ruleManager/rules/get/user/format`;
        const rulesFormatResponse:AxiosResponse<Rule[]> = await this.axiosInstance.get(rulesFormatUrl);
        return rulesFormatResponse.data
    }

    async getLintingRules(): Promise<Rule[]> {
        const rulesFormatUrl = `${this.API_URL}/ruleManager/rules/get/user/lint`;
        const rulesFormatResponse:AxiosResponse<Rule[]> = await this.axiosInstance.get(rulesFormatUrl);
        return rulesFormatResponse.data
    }

    async getTestCases(id: number): Promise<TestCase[]> {
        const url = `${this.API_URL}:8083/testManager/get/${id}`;
        const response = await this.axiosInstance.get(url);
        return response.data.map((testCase: any) => ({
            snippetId: testCase.snippetId,
            author: testCase.author,
            id: testCase.id,
            name: testCase.name,
            input: testCase.inputs,
            output: testCase.outputs,
            envVars: testCase.envs
        }));
    }

    async formatSnippet(snippet: string): Promise<string> {
        const rulesFormatUrl = `${this.API_URL}/ruleManager/rules/get/user/format`;
        const rulesLintUrl = `${this.API_URL}/ruleManager/rules/get/user/lint`;
        const rulesFormatResponse = await this.axiosInstance.get(rulesFormatUrl);
        const rulesLintResponse = await this.axiosInstance.get(rulesLintUrl);
        const url = `${this.API_URL}/snippetManager/snippetManager/format/withRules`;
        const response: AxiosResponse<string> = await this.axiosInstance.post(url, {
            snippetId: snippet,
            formatRules: rulesFormatResponse.data,
            lintingRules: rulesLintResponse.data
        });
        return response.data;
    }

    async postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
        const url = `${this.API_URL}:8083/testManager/save`;
        const response = await this.axiosInstance.post(url, {
            snippetId: testCase.snippetId,
            authorEmail: testCase.authorEmail,
            testId: testCase.id,
            name: testCase.name,
            inputs: testCase.input,
            outputs: testCase.output,
            envs: testCase.envVars

        });
        return response.data
    }

    async removeTestCase(id: string): Promise<string> {
        const url = `${this.API_URL}8083/testManager/delete/${id}`;
        const response: AxiosResponse<string> = await this.axiosInstance.post(url);
        return response.data
    }

    async deleteSnippet(id: string): Promise<string> {
        const url = `${this.API_URL}/snippetManager/snippetManager/delete/${id}`;
        const response: AxiosResponse<string> = await this.axiosInstance.delete(url);
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
        const url = `${this.API_URL}/snippetManager/snippetManager/fileTypes`;
        const response = await this.axiosInstance.get(url);
        return response.data
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        return newRules
    }

    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        return newRules
    }
}
