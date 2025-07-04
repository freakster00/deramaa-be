import { Injectable ,UnauthorizedException} from '@nestjs/common';
import { authenticateInput, RegenerateAccessTokenInput } from './dto/create-auth.input';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/account/entities/account.entity';
import { AccountService } from 'src/account/account.service'
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly AccountService: AccountService,
    private readonly mailerService:MailerService

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
      is_superdmin: user.is_superadmin,
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

  async accountlogin(loginInput: any): Promise<{ success: Boolean; message: string; account: Account; accesstoken: string, refreshtoken: string }> {
    try {
      const phone = loginInput.phone
      const user = await this.findUserByIdentifier(loginInput)
      if (!user) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      const isMatch = await bcrypt.compare(loginInput.password, user.password);

      const bcryptedpass = await this.encrypt(loginInput.password)
      if (!(bcryptedpass === user.password)) {
        throw new UnauthorizedException('Invalid Credentials');
      }
      else {
        const access_token = this.generateAccessToken(user);
        const refresh_token = await this.generateRefreshToken(user.id)
        return {
          success: true,
          message: `Welcome ${user.firstname}`,
          account: user,
          accesstoken: access_token,
          refreshtoken: refresh_token
        }
      }
    
    }
    catch (e) {
      return {
        success: false,
        message: `Error occured while loggin in`,
        account: null,
        accesstoken: null,
        refreshtoken: null
      }
    }
  }
  async forgotPassword(email: string) {
    const user = await this.accountRepository.findOneBy({
      email: email
    })
    const passsecret = process.env.PASSWORD_RESET_KEY;
    const payload = {
      sub: email
    }
    const token = jwt.sign(payload, passsecret as string, { expiresIn: '10m' as jwt.SignOptions['expiresIn'] })
  
    const resetlink = `${process.env.FRONTEND_URL}/reset-password?toker=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: "Reset Your Password",
      html: `
      <p> Hello ${user.firstname}, </p>
      <p> You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetlink}">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email or reply to let us know.</p>
      `,
    });
  }
  
  async resetPassword(token: string, newPassword: string):Promise<{ success: boolean; message: string }> {
    try {
      const payload = jwt.verify(token, process.env.PASSWORD_RESET_KEY);
      const email = (payload.sub).toString();
      const user = await this.accountRepository.findOne({
        where: {
          email: email
        }
      });
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      const hashedPassword = await this.encrypt(newPassword);
      user.password = hashedPassword;
      await this.accountRepository.save(user);
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      return { success: false, message: 'Invalid or expired token' };
    }
  }
}

