export type Dev = {
    name: string;
}

export type ClubRequestDTO = {
    userID: string;
    brand: string;
    model: string;
    clubType: string;
    flex: string;
    shaft: string;
}

export type ClubResponseDTO = {
    userID: string;
    brand: string;
    model: string;
    clubType: string;
    flex: string;
    shaft: string;
}

export type SettingsDTO = {
    theme: string;
}