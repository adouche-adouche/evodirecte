export interface EDSessionData {
    token?: string;
    twoFaToken?: string;
    uuid?: string;
    accessToken?: string;
    accountType?: string;
    accountId?: number;
    username?: string;
    enabledModules: string[];
}
// Rest remains same
export interface EDAccount {
    id: number;
    identifiant: string;
    typeCompte: string;
    prenom: string;
    nom: string;
    email: string;
    anneeScolaireCourante: string;
    nomEtablissement: string;
    profile: {
        photo: string;
        classe?: {
            id: number;
            code: string;
            libelle: string;
        };
    };
    modules: Array<{
        code: string;
        enable: boolean;
    }>;
    accessToken?: string;
}

export interface QCMChallenge {
    question: string;
    propositions: string[];
}
