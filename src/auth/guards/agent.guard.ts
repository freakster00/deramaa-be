import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AgentGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (request) {
      const accessToken = request.headers['authorization']; // Directly using the authorization header
      const token = accessToken || this.extractTokenFromRequest(request);

      if (!token) {
        throw new ForbiddenException("Token not provided");
      }

      try {
        const decoded: any = jwt.verify(token, process.env.PASSWORD_ENCRYPTION_STRING);
        if(decoded.is_agent===true){
            return true;
        }
        else{
            return false
        }
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new ForbiddenException("Invalid token");
        } else {
          console.error('Error during authentication:', error);
          throw new ForbiddenException("Unauthorized");
        }
      }
    }
    return false;
  }

  private extractTokenFromRequest(request: any): string | null {
    const cookieHeader = request.headers['cookie'];
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';');

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken') {
        return value;
      }
    }

    return null;
  }
}

    


