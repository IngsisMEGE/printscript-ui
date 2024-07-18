export type TestCase = {
    snippetId: string;
    author: string;
    id: string;
    name: string;
    input?: string[];
    output?: string[];
    envVars?: string;
};