import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import {Message} from "@/model/User";

export async function POST(request:Request)
{
    await dbConnect()
    const {username,content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user)
        {
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {status:404}
            )
        }

    //     is user accepting the message
        if(!user.isAcceptingMessage)
        {
            return Response.json(
                {
                    success:false,
                    message:"User not accepting the message"
                },
                {status:403}
            )
        }
        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
                success:true,
                message:"message sent successfully"
            },
            {status:201}
        )
    } catch (error){
        console.log("error adding messages",error)
        return Response.json(
            {
                success:false,
                message:"internal server error"
            },
            {status:500}
        )
    }
}