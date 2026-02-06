"use client";
import React, { useEffect, useState } from 'react'
import { useUser, useClerk } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';


function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user } = useUser();
    const { signOut } = useClerk();
    const createNewUser = useMutation(api.user.CreateNewUser);
    const updateLastLogin = useMutation(api.user.UpdateLastLogin);
    const [userDetail, setUserDetail] = useState<any>();

    // Check session validity
    const sessionValidity = useQuery(
        api.user.CheckSessionValidity,
        user?.primaryEmailAddress?.emailAddress
            ? { email: user.primaryEmailAddress.emailAddress }
            : "skip"
    );

    useEffect(() => {
        user && CreateAndGetUser();
    }, [user])

    // Check for expired session
    useEffect(() => {
        if (sessionValidity && !sessionValidity.isValid && user) {
            console.log('Session expired:', sessionValidity.reason);
            // Sign out the user
            signOut();
        }
    }, [sessionValidity, user, signOut]);

    const CreateAndGetUser = async () => {
        if (user) {
            const results = await createNewUser({
                name: user.fullName ?? '',
                email: user.primaryEmailAddress?.emailAddress ?? ''
            })
            console.log(results);
            setUserDetail(results);

            // Refresh session timestamp on activity
            if (user.primaryEmailAddress?.emailAddress) {
                await updateLastLogin({
                    email: user.primaryEmailAddress.emailAddress
                });
            }
        }
    }
    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    )
}

export default Provider

