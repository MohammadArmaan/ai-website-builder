"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { ArrowRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import ThemeToggler from "./ThemeToggler";
import { SignInButton, useUser } from "@clerk/nextjs";

const MenuOptions = [
    {
        name: "pricing",
        path: "/workspace/pricing",
    },
    {
        name: "contact us",
        path: "/",
    },
];

export default function Header() {
    const { user } = useUser();
    return (
        <header className="flex items-center justify-between shadow dark:shadow-2xl dark:border-b p-5">
            {/* Logo */}
            <Logo
                height={35}
                width={35}
                headingClassName="font-bold text-lg sm:text-2xl"
                headingContent="AI Website Builder"
            />

            {/* Large Screen Nav */}
            <nav className="hidden sm:flex gap-3 ">
                {MenuOptions.map((menubar, index) => (
                    <Link href={menubar.path}>
                        <Button
                            variant={"ghost"}
                            key={index}
                            className="capitalize cursor-pointer"
                        >
                            {menubar.name}
                        </Button>
                    </Link>
                ))}
            </nav>
            <div className="hidden sm:flex gap-3 items-center">
                <ThemeToggler />
                {!user ? (
                    <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
                        <Button>
                            Get Started <ArrowRight />
                        </Button>
                    </SignInButton>
                ) : (
                    <Link href="/workspace">
                        <Button>
                            Get Started <ArrowRight />
                        </Button>
                    </Link>
                )}
            </div>

            {/* Mobile Nav */}
            <div className="flex items-center gap-3 sm:hidden">
                <ThemeToggler />

                <Sheet>
                    <SheetTrigger asChild>
                        <Menu className="cursor-pointer" />
                    </SheetTrigger>
                    <SheetContent>
                        <div className="flex items-center justify-center flex-col p-5 mt-15">
                            <Logo height={50} width={50} />
                            <h2 className="font-bold mt-5 text-xl">
                                AI Website Builder
                            </h2>
                            <div className="flex items-center justify-center flex-col gap-5 mt-20">
                                <nav className="flex flex-col justify-center items-center gap-3">
                                    {MenuOptions.map((menubar, index) => (
                                        <Link href={menubar.path}>
                                            <Button
                                                variant={"ghost"}
                                                key={index}
                                                className="capitalize cursor-pointer"
                                            >
                                                {menubar.name}
                                            </Button>
                                        </Link>
                                    ))}
                                </nav>
                                {!user ? (
                                    <SignInButton
                                        mode="modal"
                                        forceRedirectUrl={"/workspace"}
                                    >
                                        <Button>
                                            Get Started <ArrowRight />
                                        </Button>
                                    </SignInButton>
                                ) : (
                                    <Link href="/workspace">
                                        <Button>
                                            Get Started <ArrowRight />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
