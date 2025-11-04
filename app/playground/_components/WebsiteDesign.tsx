import WebPageTools from "@/components/WebPageTools";
import React, { useContext, useEffect, useRef, useState } from "react";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingSection";
import { OnSaveContext } from "@/context/OnSaveConext";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
    generatedCode: string;
};

function WebsiteDesign({ generatedCode }: Props) {
    const { onSaveData, setOnSaveData } = useContext(OnSaveContext);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [selectedScreenSize, setSelectedScreenSize] = useState("web");
    const [isIframeReady, setIsIframeReady] = useState(false);
    const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
        null
    );

    const { projectId } = useParams();
    const params = useSearchParams();
    const frameId = params.get("frameId");

    // Initialize iframe
    useEffect(() => {
        if (!iframeRef.current) return;
        const doc = iframeRef.current.contentDocument;
        if (!doc) return;

        doc.open();
        doc.write(`
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
          <div id="root"></div>
        </body>
      </html>
    `);
        doc.close();

        setTimeout(() => setIsIframeReady(true), 500);
    }, []);

    // Event listeners for selection
    useEffect(() => {
        if (!isIframeReady || !iframeRef.current) return;
        const doc = iframeRef.current.contentDocument;
        if (!doc || !doc.body) return; // ✅ Added doc.body check

        let hoverEl: HTMLElement | null = null;
        let selectedEl: HTMLElement | null = null;

        const handleMouseOver = (e: MouseEvent) => {
            if (selectedEl) return;
            const target = e.target as HTMLElement;
            if (target === doc.body || target === doc.documentElement) return;

            if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
            hoverEl = target;
            hoverEl.style.outline = "2px dotted blue";
        };

        const handleMouseOut = () => {
            if (selectedEl) return;
            if (hoverEl) {
                hoverEl.style.outline = "";
                hoverEl = null;
            }
        };

        const handleClick = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const target = e.target as HTMLElement;
            if (target === doc.body || target === doc.documentElement) return;

            if (selectedEl && selectedEl !== target) {
                selectedEl.style.outline = "";
                selectedEl.removeAttribute("contenteditable");
            }

            selectedEl = target;
            selectedEl.style.outline = "2px solid red";
            selectedEl.setAttribute("contenteditable", "true");
            selectedEl.focus();

            // ✅ Update state so ElementSettingSection gets the element
            setSelectedElement(selectedEl);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selectedEl) {
                selectedEl.style.outline = "";
                selectedEl.removeAttribute("contenteditable");
                selectedEl = null;
                setSelectedElement(null); // ✅ clear state too
            }
        };

        doc.body.addEventListener("mouseover", handleMouseOver);
        doc.body.addEventListener("mouseout", handleMouseOut);
        doc.body.addEventListener("click", handleClick);
        doc.addEventListener("keydown", handleKeyDown);

        return () => {
            doc.body.removeEventListener("mouseover", handleMouseOver);
            doc.body.removeEventListener("mouseout", handleMouseOut);
            doc.body.removeEventListener("click", handleClick);
            doc.removeEventListener("keydown", handleKeyDown);
        };
    }, [isIframeReady]);

    // Render new HTML when generatedCode changes
    useEffect(() => {
        if (!isIframeReady) return;

        const iframe = iframeRef.current;
        if (!iframe) return;
        const doc = iframe.contentDocument;
        if (!doc) return;

        const root = doc.getElementById("root");
        if (!root) return;

        let cleanHTML = generatedCode?.trim() ?? "";
        cleanHTML = cleanHTML.replace(/^```html\n?|```$/g, "").trim();

        root.innerHTML = cleanHTML;

        setTimeout(() => {
            const aos = (iframe.contentWindow as any)?.AOS;
            if (aos?.init) aos.init();

            const lucide = (iframe.contentWindow as any)?.lucide;
            if (lucide?.createIcons) lucide.createIcons();
        }, 300);
    }, [generatedCode, isIframeReady]);

    useEffect(() => {
        onSaveData && onSaveCode();
    }, [onSaveData]);

    async function onSaveCode() {
        if (iframeRef.current) {
            try {
                const iframeDoc =
                    iframeRef.current.contentDocument ||
                    iframeRef.current.contentWindow?.document;
                if (!iframeDoc) return;
                const cloneDoc = iframeDoc.documentElement.cloneNode(
                    true
                ) as HTMLElement;

                // Remove all outlines
                const AllEls = cloneDoc.querySelectorAll<HTMLElement>("*");
                AllEls.forEach((el) => {
                    el.style.outline = "";
                    el.style.cursor = "";
                });
                const html = cloneDoc.outerHTML;

                const result = await axios.put("/api/frames", {
                    designCode: html,
                    frameId: frameId,
                    projectId: projectId,
                });

                console.log("Save result:", result.data);
                toast.success("Saved Succesfully");
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-2 w-full">
            <div className="p-5 w-full flex flex-col items-center">
                <iframe
                    ref={iframeRef}
                    className={`${
                        selectedScreenSize === "web"
                            ? "w-full"
                            : "max-w-130 sm:w-130"
                    } h-[700px] shadow dark:shadow-xl border-2 rounded-xl`}
                    sandbox="allow-scripts allow-same-origin"
                />
                <WebPageTools
                    selectedScreenSize={selectedScreenSize}
                    setSelectedScreenSize={setSelectedScreenSize}
                    generatedCode={generatedCode}
                />
            </div>

            {selectedElement?.tagName === "IMG" ? (
                <ImageSettingSection
                    // @ts-ignore
                    selectedEl={selectedElement}
                />
            ) : selectedElement ? (
                <ElementSettingSection
                    // @ts-ignore
                    selectedEl={selectedElement}
                    clearSelection={() => setSelectedElement(null)}
                />
            ) : null}
        </div>
    );
}

export default WebsiteDesign;