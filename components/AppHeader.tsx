import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "@clerk/nextjs";

import ThemeToggler from "./ThemeToggler";

export default function AppHeader() {
    return (
        <div className="flex justify-between items-center p-5 shadow dark:shadow-xl dark:border-b">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
            <ThemeToggler />
            <UserButton />
            </div>
        </div>
    );
}
