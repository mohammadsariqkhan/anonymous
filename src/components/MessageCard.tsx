'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import {Message} from "@/model/User";
import {useToast} from "@/components/ui/use-toast";
import axios from "axios";

type MessageCardProps = {
    message: Message,
    onMessageDelete:(messageId:string) => void
}
function MessageCard({message,onMessageDelete}:MessageCardProps) {
   const {toast} = useToast()
    const handleDeleteConfirm = async () => {
       const response = await axios.delete(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.me
        })
        onMessageDelete(message._id)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"><X className='w-5 h-5'/>
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
    );
}

export default MessageCard;