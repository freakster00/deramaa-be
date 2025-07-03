import { Injectable } from '@nestjs/common';
import { authenticateInput, RegenerateAccessTokenInput } from './dto/create-auth.input';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/account/entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) { }

  private generateToken(payload: object, expiresIn: string): string {
    const secret = process.env.PASSWORD_ENCRYPTION_STRING;
    if (!secret) {
      throw new Error('Missing PASSWORD_ENCRYPTION_STRING in environment variables.');
    }

    return jwt.sign(payload, secret as string, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
  }

  generateAccessToken(user: Account): string {
    const payload = {
      userId: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      phone: user.phone,
      email: user.email,
      message: "Simplifying rentals",
      tokenType: "ACCESS",
      is_verified: user.is_verified,
      is_customer: user.is_customer,
      is_superdmin: user.is_superdmin,
      is_agent: user.is_agent,
    };
    return this.generateToken(payload, '3d');
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const payload = {
      userId,
      message: "Simplifying rentals",
      tokenType: "REFRESH",
    };
    return this.generateToken(payload, '168h');
  }

  async authenticate(authenticateInput: authenticateInput) {
    const user = await this.findUserByIdentifier(authenticateInput);

    if (!user) {
      return this.createResponse(false, "Invalid credentials", null, null);
    }

    const isMatch = await bcrypt.compare(authenticateInput.password, user.password);

    if (!isMatch) {
      return this.createResponse(false, "Invalid credentials", null, null);
    }

    const access_token = this.generateAccessToken(user);
    const refresh_token = await this.generateRefreshToken(user.id);

    return this.createResponse(true, "User authenticated", access_token, refresh_token);
  }

  private async findUserByIdentifier(authenticateInput: authenticateInput): Promise<Account | null> {
    try {
      return await this.accountRepository.findOne({
        where: {
          [authenticateInput.method.toLowerCase()]: authenticateInput.identifier
        }
      });
    } catch (error) {
      return null; // Optionally log the error
    }
  }

  private createResponse(success: boolean, message: string, accessToken: string | null, refreshToken: string | null) {
    return {
      success,
      message,
      accessToken,
      refreshToken,
    };
  }
  async encrypt(userPassword: string): Promise<string> {
    const password = userPassword
    const saltRound = 10
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword
  }

  async regenerateAccessToken(regenerateAccessTokenInput: RegenerateAccessTokenInput, user: any) {
    try {
      const jwtStatus = jwt.verify(regenerateAccessTokenInput.refreshToken, process.env.PASSWORD_ENCRYPTION_STRING)
      if (jwtStatus) {
        const accessToken = this.generateAccessToken(user)
        const refreshToken = await this.generateRefreshToken(user.userId)

        return {
          success: true,
          message: "Access token received successfully",
          accessToken,
          refreshToken
        }
      }
    }
    catch (e) {
      return {
        success: false,
        message: `Failed generating access token - ${e.message}`,
        accessToken: null,
        refreshToken: null
      }
    }
  }

}

