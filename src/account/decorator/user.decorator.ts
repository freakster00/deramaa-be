import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const accessToken = request.headers.authorization?.replace('Bearer ', '');

    if (accessToken) {
      try {
        const userDetails = jwt.verify(accessToken, process.env.PASSWORD_ENCRYPTION_STRING);
        
        return userDetails;
      } catch (error) {
        handleJwtError(error);
      }
    } else {
      const token = extractTokenFromRequest(request);
      if (!token) {
        throw new ForbiddenException("Token not provided");
      }

      try {
        const userDetails = jwt.verify(token, process.env.PASSWORD_ENCRYPTION_STRING);
        
        return userDetails;
      } catch (error) {
        handleJwtError(error);
      }
    }
  }
);


function handleJwtError(error: any): never {
  if (error instanceof jwt.JsonWebTokenError) {
    throw new ForbiddenException("Invalid token");
  } else {
    console.error('Error during token verification:', error);
    throw new ForbiddenException("Unauthorized");
  }
}

function extractTokenFromRequest(request: any): string | null {
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


