export interface Header {
    name: string;
    description?: any;
    value: string;
    typeName?: any;
    options?: any;
    required: boolean;
    readonly: boolean;
}

export interface ITranslationTokenResponse {
    headers: Header[];
    body: string;
    bodyFormat: string;
    statusCode: number;
    statusDescription: string;
    requestUrl: string;
    contentType: string;
    latency: number;
    isRedirected: boolean;
    warnings: any[];
}

