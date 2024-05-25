import {ApiResponse} from "@/types/ApiResponse";
import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifycode:string
): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username,otp:verifycode}),
        });
        return {
            success:true,
            message:'verification email Successfully'
        }
    } catch (emailError){
        console.log("error sending verification email",emailError)
        return {
            success:false,
            message:'Falied to send verification email'
        }
    }
}