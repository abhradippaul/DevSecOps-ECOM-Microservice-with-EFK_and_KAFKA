import * as bcrypt from 'bcrypt';

export async function createHashPassword(password: string, saltOrRounds: number) {
    return await bcrypt.hash(password, saltOrRounds);
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
}

export async function createHashRefreshToken(token: string, saltOrRounds: number) {
    return await bcrypt.hash(token, saltOrRounds);
}

export async function verifyHashRefreshToken(token: string, hashedToken: string) {
    return await bcrypt.compare(token, hashedToken);
}