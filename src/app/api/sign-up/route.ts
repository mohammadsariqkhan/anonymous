import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcrypt'
import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";


export async function POST(request:Request){
    await dbConnect()
    try {
        // taking data from request
        const {username,email,password} = await request.json()
        // console.log(username,email,password)
        const existingUserVerifiedByUsername= await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "username is already taken"
            },{status: 400})
        }
        const existingUserByEmail = await UserModel.findOne({email})
        // console.log(existingUserByEmail)
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        const hasedPassword = await bcrypt.hash(password,10)
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist with this email"
                },{status:400})
            }else{

                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else{
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password:hasedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage: true,
                messages:[]
            })
            await newUser.save()

        }
    //     send email

        const emailResponse = await sendVerificationEmail(email,username,verifyCode)

        if(!emailResponse.success)
        {
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
            success:true,
            message:"user registered successfully"
        },{status:201})

    } catch (error){
        console.error("error registering user",error)
        return Response.json({
            success:false,
            message:"Error registering user"
        },
            {
                status:500
            })
    }
}
