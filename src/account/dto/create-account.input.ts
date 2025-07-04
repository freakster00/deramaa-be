export class CreateAccountInput {
    phone:string
    otp:string
    password:string
    firstname: string
    lastname: string
    email:string
    is_customer: boolean
    is_superadmin: boolean
    is_agent: boolean
}
