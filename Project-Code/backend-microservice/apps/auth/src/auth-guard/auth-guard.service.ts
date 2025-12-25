import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { verifyToken } from '@clerk/backend';
import type { ClerkClient } from "@clerk/backend"

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        @Inject('ClerkClient')
        private readonly clerkClient: ClerkClient,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        // Check for session cookie
        const sessionToken = request.cookies.__session;

        // Check for bearer token
        const authHeader = request.headers.authorization;
        const bearerToken = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        if (!sessionToken && !bearerToken) {
            throw new UnauthorizedException('No authentication token provided');
        }

        try {
            // Try to verify the token (either session or bearer)
            const tokenToVerify = bearerToken || sessionToken;
            const tokenPayload = await verifyToken(tokenToVerify, {
                secretKey: process.env.CLERK_SECRET_KEY,
            });

            if (!tokenPayload) {
                throw new UnauthorizedException('Invalid session');
            }

            const user = await this.clerkClient.users.getUser(tokenPayload.sub);
            (request as any).user = user;
            return true;
        } catch (err) {
            console.error('Token verification error:', err);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}