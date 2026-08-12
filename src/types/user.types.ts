// 1. Core Database Entity
export interface IUser {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    role: "USER" | "ADMIN";
    created_at: Date;
    updated_at: Date;
}

// 2. Input DTO : jab user register karega to kya data ayega
export interface IRegisterUserDTO {
    name: string;
    email: string;
    password: string;
}

// 3. Input DTO: jab usr login karega
export interface ILoginUserDTO {
    email: string;
    password: string;
}

// 4. Output DTO : Client ko return karne wala data (password hata kar)
export interface IUserResponseDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: Date;
}