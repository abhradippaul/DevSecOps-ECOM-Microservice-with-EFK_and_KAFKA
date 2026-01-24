import { UserRole } from "apps/common/enum/auth/user-role.enum"

export interface UserDetails {
    sub: string
    role: UserRole.ADMIN | UserRole.BUYER | UserRole.SELLER
    iat: number
    exp: number
}