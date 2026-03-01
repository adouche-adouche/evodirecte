import { BASE_URL, DEFAULT_USER_AGENT, API_VERSION, EDResponse, EDError, EDAuthError, EDRateLimitError } from "../types";

export interface RequestOptions {
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    body?: any;
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

export class Fetcher {
    constructor(
        private token?: string,
        private twoFaToken?: string,
        private userAgent: string = DEFAULT_USER_AGENT,
        private uuid?: string
    ) {
        if (this.uuid) {
            this.userAgent = `evoDirecte/1.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 EDMOBILE v${API_VERSION}`;
        }
    }

    setToken(token: string) {
        this.token = token;
    }

    set2FAToken(token: string) {
        this.twoFaToken = token;
    }

    setUuid(uuid: string) {
        this.uuid = uuid;
        this.userAgent = `evoDirecte/1.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 EDMOBILE v${API_VERSION}`;
    }

    async request<T>(options: RequestOptions): Promise<EDResponse<T>> {
        const url = new URL(`${BASE_URL}${options.path}`);
        url.searchParams.set("v", API_VERSION);
        if (options.params) {
            for (const [key, value] of Object.entries(options.params)) {
                url.searchParams.set(key, value);
            }
        }

        const headers: Record<string, string> = {
            "User-Agent": this.userAgent,
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://www.ecoledirecte.com",
            "Referer": "https://www.ecoledirecte.com/",
            ...options.headers,
        };

        if (this.token) {
            headers["X-Token"] = this.token;
        }

        if (this.twoFaToken) {
            headers["2fa-Token"] = this.twoFaToken;
        }

        if (this.uuid) {
            headers["X-Client"] = "mobile";
        }

        let body: string | undefined;
        if (options.body !== undefined) {
            const data = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
            body = `data=${encodeURIComponent(data)}`;
        }

        const response = await fetch(url.toString(), {
            method: options.method,
            headers,
            body,
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const resData = (await response.json()) as EDResponse<T>;

        if (resData.token) {
            this.token = resData.token;
        }

        const new2faToken = response.headers.get("2fa-Token");
        if (new2faToken) {
            this.twoFaToken = new2faToken;
        }

        if (resData.code !== 200) {
            this.handleError(resData);
        }

        return resData;
    }

    private handleError(res: EDResponse<any>): never {
        switch (res.code) {
            case 505:
            case 250:
            case 520:
                throw new EDAuthError(res.code, res.message);
            case 525:
                throw new EDAuthError(res.code, "Token expired");
            default:
                throw new EDError(res.code, res.message || "Unknown error");
        }
    }
}
