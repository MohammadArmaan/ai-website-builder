import Logo from "@/components/Logo";
import ThemeToggler from "@/components/ThemeToggler";
import { Button } from "@/components/ui/button";
import { OnSaveContext } from "@/context/OnSaveConext";
import { useContext } from "react";

export default function PlaygroundHeader() {
    const {onSaveData, setOnSaveData} = useContext(OnSaveContext);
    return (
        <header className="flex items-center justify-between p-5 shadow dark:shadow-xl dark:border-b">
            <Logo
                height={35}
                width={35}
                headingContent="AI Website Builder"
                headingClassName="font-bold text-base sm:text-xl"
            />
            <div className="flex items-center gap-3">

            <ThemeToggler />
            <Button onClick={() => setOnSaveData(Date.now())}>Save</Button>
            </div>
        </header>
    );
}
