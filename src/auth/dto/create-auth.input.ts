import { IsString,IsNotEmpty } from "class-validator"


export class authenticateInput {
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

export class RegenerateAccessTokenInput {
    refreshToken:string
}
