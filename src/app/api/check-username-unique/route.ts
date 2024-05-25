import {z} from 'zod'
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {usernameValidation} from "@/schemas/signUpSchema";
import {log} from "util";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request)
{
    //TODO use this in all other routes
    // if(request.method !== 'GET')
    // {
    //     return Response.json({
    //         success:false,
    //         message: "Method is not allowed"
    //     },{status:405})
    // }
    dbConnect()
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username'),
        };
        const result = UsernameQuerySchema.safeParse(queryParams);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            console.log('not good')
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(', ')
                            : 'Invalid query parameters',
                },
                { status: 400 }
            );
        }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
        if(existingVerifiedUser)
        {
            return Response.json({
            success: false,
            message: "username is already taken"
        },{status: 400})
        }

        return Response.json({
            success: true,
            message: "username is unique"
        },{status: 200})
    } catch (error){
        console.error("error checking username", error)
        return Response.json({
            success:false,
            message:"error checking username"
        }, {status:500})
    }
}
