"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Progress } from "./ui/progress";
import { useAuth, UserButton } from "@clerk/nextjs";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export function AppSidebar() {
    const [projectList, setProjectList] = useState([]);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [loading, setLoading] = useState(false);
    const { has } = useAuth();

    const hasUnlimitedAccess = has && has({ plan: "unlimited" });

    useEffect(() => {
        getProjectList();
    }, []);

    async function getProjectList() {
        setLoading(true);
        const result = await axios.get("/api/get-all-projects");
        console.log(result.data);
        setProjectList(result.data);
        setLoading(false);
    }
    return (
        <Sidebar>
            <SidebarHeader className="p-5">
                <Logo
                    width={35}
                    height={35}
                    headingContent="AI Website Builder"
                    headingClassName="font-bold text-xl"
                />
                <Link href={"/workspace"} className="mt-5 w-full">
                    <Button className="w-full">+ Add New Project</Button>
                </Link>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarGroup>
                    <SidebarGroupLabel>Projects</SidebarGroupLabel>
                    {!loading && projectList.length === 0 && (
                        <h2 className="text-sm text-muted-foreground px-2">
                            No Projects Found
                        </h2>
                    )}
                    <div>
                        {!loading && projectList.length > 0
                            ? projectList.map((project: any, index) => (
                                <Link
                                    href={`/playground/${project.projectId}?frameId=${project.frameId}`}
                                    key={index}
                                    className=""
                                >
                                    <h2 className="line-clamp-1 hover:underline hover:bg-secondary p-1 hover:rounded-lg cursor:pointer">
                                        {
                                            project?.chats[0].chatMessages[0]?.content
                                        }
                                    </h2>
                                </Link>
                            ))
                            : [1, 2, 3, 4, 5].map((_, index) => (
                                <Skeleton className="w-full h-10 rounded-lg mt-2" />
                            ))}
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-3">
                {!hasUnlimitedAccess && <div className="p-3 border rounded-xl space-y-3 bg-secondary">
                    <h2 className="flex items-center justify-between">
                        Reamining Credits{" "}
                        <span className="font-bold">{userDetail?.credits}</span>
                    </h2>
                    <Progress value={(userDetail?.credits / 5) * 100} />
                    <Link href={"/workspace/pricing"} className="w-full">
                        <Button className="w-full">Upgrade to Unlimited</Button>
                    </Link>
                </div>}
                <div className="flex gap-2">
                    <UserButton />
                    <Button variant={"ghost"}>Settings</Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
