"use client";
import { OnSaveContext } from "@/context/OnSaveConext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState<any>();
    const [onSaveData, setOnSaveData] = useState<any>()

    useEffect(() => {
        user && createNewUser();
    }, [user]);

    async function createNewUser() {
        const result = await axios.post("/api/users", {});
        console.log(result.data);
        setUserDetail(result.data?.user);
    }

    return (
        <div>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                <OnSaveContext.Provider value={{onSaveData, setOnSaveData}}>
                    {children}
                </OnSaveContext.Provider>
            </UserDetailContext.Provider>
        </div>
    );
}
