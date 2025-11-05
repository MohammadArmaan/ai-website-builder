"use client";

import {
    ArrowUpIcon,
    HomeIcon,
    ImagePlus,
    Key,
    LayoutDashboard,
    Loader2,
    User,
} from "lucide-react";
import { Button } from "./ui/button";
import { useContext, useState } from "react";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";

const suggestions = [
    {
        label: "Dashboard",
        prompt: "Create an analytics dashboard to track customers and revenue data for a SaaS",
        icon: <LayoutDashboard />,
    },
    {
        label: "SignUp Form",
        prompt: "Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox",
        icon: <Key />,
    },
    {
        label: "Hero",
        prompt: "Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect, subtitle, CTA, small social proof and an image.",
        icon: <HomeIcon />,
    },
    {
        label: "User Profile Card",
        prompt: "Create a modern user profile card component for a social media website",
        icon: <User />,
    },
];

const generateRandomFrameNumber = () => {
    const number = Math.floor(Math.random() * 10000);
    return number;
};

export default function Hero() {
    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    const { has } = useAuth();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const hasUnlimitedAccess = has && has({ plan: "unlimited" });

    async function createNewProject() {
        if (!hasUnlimitedAccess && userDetail?.credits! <= 0) {
            toast.error("You have no credits left. Please upgrade your plan");
            return;
        }
        setLoading(true);
        const projectId = uuidv4();
        const frameId = generateRandomFrameNumber();
        const messages = [
            {
                role: "user",
                content: userInput,
            },
        ];

        try {
            const result = await axios.post("/api/projects", {
                projectId: projectId,
                frameId: frameId,
                messages: messages,
                credits: userDetail?.credits,
            });
            console.log(result.data);

            toast.success("Project created");

            // Navigate to Playground
            router.push(`/playground/${projectId}?frameId=${frameId}`);
            setUserDetail((prev: any) => ({
                ...prev,
                credits: prev?.credits! - 1,
            }));
        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] px-5 sm:p-0">
            {/* Header & Description */}
            <h2 className="font-bold text-4xl text-primary md:text-5xl lg:text-6xl text-center">
                What Should We Design?
            </h2>
            <p className="mt-2 text-muted-foreground text-center">
                Generate, Edit and Explore with AI, Export code as well
            </p>

            {/* Input Box */}
            <div className="w-full max-w-xl p-5 border mt-5 rounded-2xl">
                <textarea
                    placeholder="Describe your page design"
                    className="w-full h-24 focus:outline-none focus:ring-0 resize-none placeholder:text-muted-foreground"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <div className="flex justify-end">
                    {/* <Button variant={"ghost"}>
                        <ImagePlus />
                    </Button> */}
                    {!user ? (
                        <SignInButton
                            mode="modal"
                            forceRedirectUrl={"/workspace"}
                        >
                            <Button disabled={!userInput}>
                                <ArrowUpIcon />
                            </Button>
                        </SignInButton>
                    ) : (
                        <Button
                            disabled={!userInput || loading}
                            onClick={() => createNewProject()}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <ArrowUpIcon />
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Suggestion List */}
            <div className="mt-3 flex gap-3 flex-wrap">
                {suggestions.map((suggestion, index) => (
                    <Button
                        variant={"outline"}
                        onClick={(e) => setUserInput(suggestion.prompt)}
                        key={index}
                    >
                        {suggestion.label} {suggestion.icon}
                    </Button>
                ))}
            </div>
        </div>
    );
}
