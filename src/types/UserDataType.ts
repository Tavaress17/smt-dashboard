// src/types/UserDataType.ts

export interface LoginResponseDTO {
    id: string;
    username: string;
    email: string;
    authorities: string[];
    token: string;
    expirationTime: number;
}

export interface LoginUserDataType {
    status: 'success' | 'error';
    error?: string;
    message: string;
    data: LoginResponseDTO;
}