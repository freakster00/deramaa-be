import { forwardRef, Injectable ,Inject} from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { MobileOTP } from './entities/otp.entity';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class AccountService {
  
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(MobileOTP)
    private readonly mobileOtpRepository: Repository<MobileOTP>,

    @Inject(forwardRef(()=>AuthService))
    private readonly authService: AuthService
  ){}
  async create(createAccountInput: CreateAccountInput) {
    const verifyOtpInput = {
      phone: createAccountInput.phone,
      otp: createAccountInput.otp
    };
    const otpStatus = await this.verifyOtp(verifyOtpInput);
    if (otpStatus) {
      try {
        if (createAccountInput.password.length >= 8) {
          const db_resp = await this.accountRepository.save({
            email: createAccountInput.email,
            firstname: createAccountInput.firstname,
            lastname: createAccountInput.lastname,
            password: await this.authService.encrypt(createAccountInput.password),
            phone: verifyOtpInput.phone
          });
          const response = {
            success: true,
            message: "Account created successfully",
            account: db_resp
          };
          await this.mobileOtpRepository.update({ phoneNumber: verifyOtpInput.phone }, { revoked: true });
          return response;
        } else {
          return {
            success: false,
            message: "Password must be greater than 7 characters.",
            account: null
          };
        }
      } catch (error) {
        const error_detail = error.detail;
        const response = {
          success: false,
          message: error_detail,
          details: null
        };
        return response;
      }
    } else {
      return {
        success: false,
        message: "OTP verification error",
        details: null
      };
    }
  }
  
  async sendOtp(sendOtpInput): Promise<{success: boolean; message: string}> {
    try {
      
      const existingAccount = await this.accountRepository.findOne({ 
       where:{ phone: sendOtpInput.phone}
       });
      
      if (existingAccount) {
        return { success: false, message: 'Phone number already exists' };
      }
      
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otp_instance=await this.mobileOtpRepository.findOne({
        where:{
          phoneNumber:sendOtpInput.phone,
        }
      })
      
      if(otp_instance){
        
      await this.mobileOtpRepository.remove(otp_instance)
      }
      await this.mobileOtpRepository.save({
        phoneNumber: sendOtpInput.phone,
        otp: String(otp),
        revoked: false,
      });

      
      await this.sendOtpViaSms(sendOtpInput.phone, otp);
      //console.log(`Your OTP for account registration for Deramaa is: ${otp}`);
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.log(error.message);
      return { success: false, message: 'Error occurred sending OTP' };
    }
  }

  private async sendOtpViaSms(phone: string, otp: number): Promise<void> {
    try {
      await axios.get('https://bulk.bedbyaspokhrel.com.np/smsapi/index.php', {
        params: {
          key: process.env.SMS_KEY,
          campaign: 'XXXXXX',
          routeid: 'XXXXXX',
          type: 'text',
          contacts: phone,
          senderid: 'XXXXXX',
          msg: `Your OTP for account registration for Deramaa is: ${otp}`,
        },
      });
    } catch (error) {
      throw new Error('Failed to send SMS');
    }
  }
  

  async verifyOtp(verifyOtpInput): Promise<boolean> {
    try {
      const otpResp = await this.mobileOtpRepository.findOne({
        where: {
          phoneNumber: verifyOtpInput.phone,
        },
      });
      
      if (otpResp) {
        if(otpResp.revoked===true){
          return false
        }
        else{
        return otpResp.otp === verifyOtpInput.otp;
        }
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }


  async findAll(input:any) {
    try{
      const accountInstances=await this.accountRepository.find({
        skip:input.skip,
        take:input.take,
        order:{
          account_created:'DESC'
        }
      })
      if(accountInstances.length!=0){
        return {
          success:true,
          message:"Accounts found",
          accounts:accountInstances
        }
      }
      else{
        return {
          success:false,
          message:"Accounts not found",
          account:null
        }
      }
   }
   catch(e){
    return {
      success:false,
      message:`Accounts not found - ${e.message}`,
      account:null
    }
   }
  }
  async findOneByphone(phone: string) {
    try {
      const accountInstance = await this.accountRepository.findOne({
        where: {
          phone:phone
        }
      })
      if (accountInstance != undefined) {
        return {
          success: true,
          message: "Account found",
          account: accountInstance
        }
      }
      else {
        return {
          success: false,
          message: "Account not found",
          account: null
        }
      }
    }
    catch (e) {
      return {
        success: false,
        message: `Account not found - ${e.message}`,
        account: null
      }
    }
  }
     
  async findOne(id: number) {
   try{
      const accountInstance=await this.accountRepository.findOne({
        where:{
          id
        }
      })
      if(accountInstance!=undefined){
        return {
          success:true,
          message:"Account found",
          account:accountInstance
        }
      }
      else{
        return {
          success:false,
          message:"Account not found",
          account:null
        }
      }
   }
   catch(e){
    return {
      success:false,
      message:`Account not found - ${e.message}`,
      account:null
    }
   }
  }

  async update(updateAccountInput: UpdateAccountInput,user) {
    try{
      const updateAccountResponse=await this.accountRepository.update({
          id:user.userId
      },{
        firstname:updateAccountInput.firstname,
        lastname: updateAccountInput.lastname,
        email: updateAccountInput.email,
        phone:updateAccountInput.phone
      })
        const updatedAccountInstance=await this.accountRepository.findOne({
          where:{
            id:user.userId
          }
        })
      if(updateAccountResponse.affected==1){
        return {
          success:true,
          message:"Account updated successfully",
          account: updatedAccountInstance
        }
      }
      else{
        return {
          success:false,
          message:"Failed updating account",
          account: null
        }
      }
    }
    catch(e){
      return {
        success:false,
        message:`Failed updating account - ${e.message}`,
        account: null
      }
    }
  }
  async removeaccount(id: number) {
    try {
      const removeResp = await this.accountRepository.softDelete(id);
      if (removeResp.affected === 1) {
        return {
          success: true,
          message: 'Account removed successfully',
        };
      } else {
        return {
          success: false,
          message: 'Error occured removing the account',
        };
      }
    } catch (e) {
      return {
        success: false,
        message: `Error occured removing the account - ${e.message}`,
      };
    }
  }
/*   async resetpassword(resetpasswordInput: any) {

  } */

  async removeAccountAsSuperadmin(id: number) {
    try{
      const removeResp=await this.accountRepository.softDelete(id)
      if(removeResp){
        return {
          success:true,
          message:"Account removed successfully"
        }
      }else{
        return {
          success:false,
          message:"Error occured removing the account"
        }
      }
    }
  
    catch(e){
      return {
        success:false,
        message:`Error occured removing the account - ${e.message}`
      }
    }
  }
}

