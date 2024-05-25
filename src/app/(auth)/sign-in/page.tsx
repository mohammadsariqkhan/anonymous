'use client'
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import '../../globals.css'
import {useEffect, useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {signUpSchema} from "@/schemas/signUpSchema";
import {ApiResponse} from "@/types/ApiResponse";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {signInSchema} from "@/schemas/signInSchema";
import {signIn} from "next-auth/react";


function Page() {
    const {toast} = useToast()
    const router = useRouter()

    // zod
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })
    const onSubmit = async (data:z.infer<typeof signInSchema>) => {
            const result = await signIn('credentials',{
                redirect:false,
                identifier: data.identifier,
                password:data.password
            })
        if(result?.error)
        {
            toast({
                title:'Login Failed',
                description:'Incorrect username or password',
                variant:"destructive"
            })
        }
        if(result?.url)
        {
            router.replace('/dashboard')
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">
                        sign in to start your anonymous adventure
                    </p>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}
                                  className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="identifier"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email/Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email" {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="password" {...field}

                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type='submit'>
                                    Signin
                                </Button>
                            </form>
                        </Form>
                        <Button className='mt-4' onClick={() =>{
                            signIn('google')
                        }
                        }>
                            Sign in with Google
                        </Button>
                        <div className="text-center mt-4">
                            <p>
                                Already a memeber?{' '}
                                <Link href="/sign-up" className="text-blue-600">
                                    Sign-up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;