import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    height: number;
    width: number;
    className?: string;
    headingClassName?: string;
    headingContent?: string;
}

export default function Logo({
    height,
    width,
    className,
    headingClassName,
    headingContent,
}: LogoProps) {
    return (
        <Link href="/">
            <div className="flex items-center gap-2">
                <Image
                    src="/logo.svg"
                    height={height}
                    width={width}
                    className={className}
                    alt="Logo"
                />
                <h2 className={headingClassName}>{headingContent}</h2>
            </div>
        </Link>
    );
}
