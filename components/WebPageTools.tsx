import {
    Code2Icon,
    Download,
    Monitor,
    SquareArrowOutUpRight,
    TabletSmartphone,
} from "lucide-react";
import { Button } from "./ui/button";
import { ViewCodeBlock } from "@/app/playground/_components/ViewCodeBlock";
import { useEffect, useState } from "react";

interface WebpageToolsProps {
    selectedScreenSize: string;
    setSelectedScreenSize: (input: string) => void;
    generatedCode: string;
}

const HTML_CODE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Website Builder Preview</title>

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Flowbite -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

    <!-- AOS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

    <!-- Lucide / Font Awesome -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <!-- Lottie -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

    <!-- Swiper -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <!-- Tippy -->
    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>

    <style>
      body { margin: 0; overflow-x: hidden; }
    </style>
  </head>
  <body>
    <div id="root">
      {code}
    </div>

    <script>
      // Initialize Flowbite and AOS if present
      if (window.AOS) AOS.init();
      if (window.lucide) lucide.createIcons();
    </script>
  </body>
</html>
`;

export default function WebPageTools({
    selectedScreenSize,
    setSelectedScreenSize,
    generatedCode,
}: WebpageToolsProps) {
    const [finalCode, setFinalCode] = useState<string>();

    useEffect(() => {
        if (!generatedCode) return;
        
        // Clean the generated code by removing markdown code blocks
        let cleanedCode = generatedCode.trim();
        if (cleanedCode.startsWith("```html")) {
            cleanedCode = cleanedCode.replace(/^```html\n?/, "");
        }
        if (cleanedCode.startsWith("```")) {
            cleanedCode = cleanedCode.replace(/^```\n?/, "");
        }
        if (cleanedCode.endsWith("```")) {
            cleanedCode = cleanedCode.replace(/```$/, "");
        }
        cleanedCode = cleanedCode.trim();
        
        const fullCode = HTML_CODE.replace("{code}", cleanedCode);
        setFinalCode(fullCode);
    }, [generatedCode])

    function viewInNewTab() {
        if (!finalCode) return;

        const blob = new Blob([finalCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");
    }

    function downloadCode() {
        if (!finalCode) return;
        
        const blob = new Blob([finalCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "index.html"
        document.body.append(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url)

    }

    return (
        <div className="p-2 shadow dark:shadow-xl dark:border rounded-xl w-full flex items-center justify-between flex-wrap">
            <div className="flex gap-2">
                <Button
                    variant={"ghost"}
                    onClick={() => setSelectedScreenSize("web")}
                    className={
                        selectedScreenSize === "web"
                            ? "border border-primary"
                            : ""
                    }
                >
                    <Monitor />
                </Button>
                <Button
                    variant={"ghost"}
                    onClick={() => setSelectedScreenSize("mobile")}
                    className={
                        selectedScreenSize === "mobile"
                            ? "border border-primary"
                            : ""
                    }
                >
                    <TabletSmartphone />
                </Button>
            </div>
            <div className="flex gap-2">
                <Button variant={"outline"} onClick={() => viewInNewTab()}>
                    <span className="hidden sm:inline">View</span>{" "}
                    <SquareArrowOutUpRight />
                </Button>
                <ViewCodeBlock code={finalCode}>
                    <Button variant={"outline"}>
                        <span className="hidden sm:inline">Code</span>{" "}
                        <Code2Icon />
                    </Button>
                </ViewCodeBlock>
                <Button variant={"outline"} onClick={downloadCode}>
                    <span className="hidden sm:inline">Download</span>{" "}
                    <Download />
                </Button>
            </div>
        </div>
    );
}