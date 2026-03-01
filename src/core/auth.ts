import { Fetcher } from "../utils/fetcher";
import { decodeBase64, encodeBase64 } from "../utils/base64";
import { EDAccount, QCMChallenge } from "../types/auth";
import { EDAuthError, API_VERSION, DEFAULT_USER_AGENT } from "../types";

export class AuthManager {
    private gtkToken: string = "";

    constructor(private fetcher: Fetcher) {}

    async getGTK(): Promise<string> {
        const url = new URL("https://api.ecoledirecte.com/v3/login.awp");
        url.searchParams.set("gtk", "1");
        url.searchParams.set("v", API_VERSION);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "User-Agent": DEFAULT_USER_AGENT
            }
        });

        let gtk = response.headers.get("X-GTK") || response.headers.get("X-Gtk");

        if (!gtk) {
            const setCookie = response.headers.get("set-cookie");
            if (setCookie) {
                const match = setCookie.match(/GTK=([^;]+)/);
                if (match) gtk = match[1];
            }
        }

        this.gtkToken = gtk || "";
        return this.gtkToken;
    }

    async login(username: string, password: string, uuid?: string, fa?: { cn: string, cv: string }[]): Promise<any> {
        const gtk = await this.getGTK();

        const is2FA = fa && fa.length > 0;

        const body: any = {
            identifiant: username,
            motdepasse: password,
            // Consistently use isRelogin for both initial and 2FA validation
            isRelogin: false,
            uuid: uuid || ""
        };

        if (uuid) {
            body.sesouvenirdemoi = true;
        }

        if (is2FA) {
            body.fa = fa.map(f => ({ cn: f.cn, cv: f.cv, uniq: "false" }));
            body.cn = fa[0].cn;
            body.cv = fa[0].cv;
        }

        try {
            const res = await this.fetcher.request<any>({
                method: "POST",
                path: "/login.awp",
                body,
                headers: {
                    "X-Gtk": gtk,
                    "Cookie": `GTK=${gtk}`
                }
            });
            return res;
        } catch (e) {
            if (e instanceof EDAuthError && e.code === 250) {
                return { code: 250 };
            }
            throw e;
        }
    }

    async getQCM(): Promise<QCMChallenge> {
        const res = await this.fetcher.request<any>({
            method: "POST",
            path: "/connexion/doubleauth.awp",
            params: { verbe: "get" },
            body: {}
        });

        return {
            question: decodeBase64(res.data.question),
            propositions: res.data.propositions.map((p: string) => decodeBase64(p))
        };
    }

    async solveQCM(answer: string): Promise<{ cn: string, cv: string }> {
        const res = await this.fetcher.request<any>({
            method: "POST",
            path: "/connexion/doubleauth.awp",
            params: { verbe: "post" },
            body: {
                choix: encodeBase64(answer)
            }
        });

        return {
            cn: res.data.cn,
            cv: res.data.cv
        };
    }

    async refresh(username: string, uuid: string, accessToken: string, accountType: string): Promise<any> {
        const gtk = await this.getGTK();
        const res = await this.fetcher.request<any>({
            method: "POST",
            path: "/login.awp",
            body: {
                identifiant: username,
                uuid,
                isReLogin: true, // Silent refresh uses capital L
                motdepasse: "",
                typeCompte: accountType,
                accesstoken: accessToken
            },
            headers: {
                "X-Gtk": gtk,
                "Cookie": `GTK=${gtk}`
            }
        });
        return res;
    }
}
