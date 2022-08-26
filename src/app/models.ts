export interface Chat {
    iD_S: number;
    iD_TS: number;
    nombrE_S: string;
    urlfotO_S: string;
    iD_U: number;
}

export interface ChatActive {
    iD_S: number;
    iD_TS: number;
    nombrE_S: string;
    urlfotO_S: string;
    fechA_M: Date;
    contenidO_M: string;
    iD_TM: number;
    nombrE_U: string;
    nummensajessinleeR_S: number;
}

export interface Message {
    iD_M: number;
    iD_S: number;
    meN_ID_M: number;
    iD_TM: number;
    iD_U: number;
    contenidO_M: string;
    fechA_M: Date;
    urL_M: string;
}

export interface MessageStatusDetail {
    iD_M: number;
    iD_U: number;
    iD_EM: number;
    fechA_DEM: Date;
    nombrE_U: string;
    urlfotO_U: string;
}

export interface User {
    iD_U: number;
    iD_EU: number;
    nombrE_U: string;
    usuariO_U: string;
    contraseniA_U: string;
    ultimaconeX_U: Date;
    urlfotO_U: string;
    administrA_U: boolean;
    habilitadO_U: boolean;
    signaliD_U: string;
}

export interface ChatUsers {
    iD_U: number;
    iD_EU: number;
    nombrE_U: string;
    ultimaconeX_U: Date;
    urlfotO_U: string;
    habilitadO_U: boolean;
    signaliD_U: string;
}