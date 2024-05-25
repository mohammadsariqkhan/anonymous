// @flow
'use client'
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {User} from 'next-auth'
import {Button} from "@/components/ui/button";
export function Navbar() {
    const {data:session} = useSession()
    const user = session?.user as User
    return (
        <nav className='p-4 md:p-5 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a className='text-xl font-bold mb-4 md:mb-0' href="#">Mystry Message</a>
                {
                    session ? (
                        <>
                        <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                        <Button className='w-full md:w-auto' onClick={() => signOut()}>
                            Logout
                        </Button>
                        </>
                    ) : (
                        <Link href='/sign-in'>
                            <Button className='w-full md:w-auto'>
                                Sign-in
                            </Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    );
};