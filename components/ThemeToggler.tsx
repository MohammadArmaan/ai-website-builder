"use client";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export default function ThemeToggler() {
    const { theme, setTheme } = useTheme();
    return (
        <div>
            <Button
            variant={"outline"}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotated-0 scale-100 transition-all darK:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
        </div>
    );
}
