
const API_PATH = "http://localhost"
const API_PORT = "8742";
const API_VERSION = "api/v1/";

const API_LOCAL = API_PATH + ":" + API_PORT + "/" + API_VERSION;


export type ErrorType = {
    status: number,
    success: boolean,
    message: string
}

export type DataAuthType = {
    status: number,
    success: boolean,
    data: {
        token: string,
        id: number
    },
    message: string
};

export type AuthType = {
    username: string,
    password: string
};

export type RegisterType = {
    email: string,
    password: string
};



export type DataIdentityType = {
    status: number,
    success: boolean,
    data: any,
    message: string
};

export type IdentityType = {
    name: string,
    sex: boolean | null,
    birthday: string
};



export type DataContactType = {
    status: number,
    success: boolean,
    data: any,
    message: string
};

export type ContatctType = {
    phone: string,
    email: string,
};


type TCroquetteProps = {
    brand: {
        name: string,
    },
    categories: [
        { typePet: string },
        { typePet: string },
        { typePet: string },
    ],
    characteristic: {
        cendres: number,
        eau: number,
        fibre: number,
        glucide: number,
        lipide: number,
        proteine: number

    }
    id: number
    name: string,
    productId: string,
    sterilise: boolean,
    url: string,
    urlimage: string,
    validate: boolean
}


export type ListCroquetteType = {
    status: number,
    success: boolean,
    data: null | Array<TCroquetteProps>,
    message: string
};


export type ShowCroquetteType = {
    status: number,
    success: boolean,
    data: null | TCroquetteProps,
    message: string
};

export async function loginQuery({ username, password }: AuthType): Promise<DataAuthType> {

    const response = await fetch(API_LOCAL + 'login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username, "password": password,
        })
    })

    const responseData = await response.json();

    if (response.ok) {
        return responseData;
    }

    throw new Error(responseData.message);
}



export async function registerQuery({ email, password }: RegisterType): Promise<DataAuthType> {
    const response = await fetch(API_LOCAL + 'register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": email, "password": password,
        })
    })

    const responseData = await response.json();
    if (response.ok) {
        return responseData;
    }
    throw new Error(responseData.message);
}



export async function IdentityQuery({ name, sex, birthday }: IdentityType): Promise<DataIdentityType> {
    const API_USER = JSON.parse(localStorage.getItem('user') || '');
    let date = birthday.toLocaleString();

    const response = await fetch(API_LOCAL + 'identity', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'BEARER ' + API_USER?.token,
        },
        body: JSON.stringify({
            "name": name, "sex": sex, "birthday": date
        })
    })

    const responseData = await response.json();

    return responseData;
}



export async function getIdentityQuery(): Promise<DataIdentityType> {
    const API_USER = JSON.parse(localStorage.getItem('user') || '');


    const response = await fetch(API_LOCAL + 'identity/' + API_USER?.id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'BEARER ' + API_USER?.token,
        },
    })

    const responseData = await response.json();

    return responseData;
}





export async function getCroquetteQuery(): Promise<DataContactType> {

    const API_USER = JSON.parse(localStorage.getItem('croquette') || '');

    const response = await fetch(API_LOCAL + 'croquette/' + API_USER?.id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'BEARER ' + API_USER?.token,
        },
    })

    const responseData = await response.json();

    return responseData;
}







// Définition de l'interface des valeurs du formulaire
export interface FormValuesTypes {
    marque: string;
    croquette: string;
    race: string;
    stade: string;
    activite: string;
    morphologie: string;
    sterilite: string;
}

// Définition de l'interface du tableau de marques
export interface BrandTypes {
    value: string;
    key: string;
}


// Définition de l'interface du tableau de croquette
export interface CroquetteTypes {
    value: string;
    key: number;
}


// interface AnalyseDataRequestTypes {
//     animal: string;
//     race: string;
//     stade: string;
//     activite: string;
//     morphologie: string;
//     sterilite: boolean;
// }


export interface AnalyseDataResponseTypes {
    status: number;
    success: boolean;
    message: string;
    data: {
        marque: string;
        name: string;
        sterilise: boolean;
        energie_metabolisable: number; //(en_kcal/100g)
        besoin_energetique: number;
        analyse_quantitatif_nutriment: {
            proteine: boolean;
            lipide: boolean;
            ENA: boolean;
        };
        quantite_Journaliere: number;  //(en_g/jour)
        url: string;
        urlimage: string;
        element_nutritif: {
            ENA: number;
            proteine: number;
            lipide: number;
            fibre: number;
            cendres: number;
            eau: number;
        };
        score: number;
        commentaire: string;
    };
}