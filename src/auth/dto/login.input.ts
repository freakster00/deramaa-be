import { InputType, Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { Account } from "src/account/entities/account.entity";

@InputType()
export class loginInput{
    @IsString()
        @IsNotEmpty()
        method:string;
    
        @IsString()
        @IsNotEmpty()
        identifier:string;
    
        @IsString()
        @IsNotEmpty()
        password:string;
}

@ObjectType()
export class LoginResponse{
    @Field()
    success: Boolean;
    @Field()
    message: string;
    @Field({ nullable: true })
    accesstoken?: string;
    @Field({ nullable: true })
    refrehtoken?: string;
    @Field(()=>Account,{ nullable: true })
    account?: Account;
}
