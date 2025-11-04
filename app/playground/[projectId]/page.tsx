"use client";

import { useParams, useSearchParams } from "next/navigation";
import ChatSection from "../_components/ChatSection";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import WebsiteDesign from "../_components/WebsiteDesign";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

export type Frame = {
    projectId: string;
    frameId: string;
    designCode: string;
    chatMessages: Messages[];
};

export type Messages = {
    role: string;
    content: string;
};

const prompt = `
# 🎨 Enhanced Web Design Prompt

You are an expert web designer and developer specializing in creating **beautiful, modern, and user-friendly** websites with harmonious color schemes and professional aesthetics.

User Request: {userInput}

---

## Instructions:

### 1. If the user is asking for code/design generation:

Generate a COMPLETE, FULL-PAGE HTML code for the <body> section with the following specifications:

#### 🎯 CRITICAL REQUIREMENTS:
- Generate a COMPLETE webpage, not partial sections
- Include ALL necessary sections: header/nav, hero, features, content sections, footer
- Make it a FULL, scrollable page with substantial content
- Generate ONLY the <body> tag and its content
- DO NOT include <!DOCTYPE html>, <html>, <head>, or any CDN links
- Start directly with <body> and end with </body>
- Wrap your response in html code blocks

---

#### 🎨 COLOR SCHEME & VISUAL HARMONY (CRITICAL):

**Philosophy:** Create a **calm, professional, and inviting** aesthetic that feels premium without being overwhelming.

**Primary Color Palettes** (choose ONE per design):

1. **Professional Blue:** 
   - Gradients: from-blue-50 to-indigo-100, from-blue-500 to-indigo-600
   - Accents: bg-blue-600, text-blue-600, border-blue-200
   
2. **Fresh Green:**
   - Gradients: from-emerald-50 to-teal-100, from-emerald-500 to-teal-600
   - Accents: bg-emerald-600, text-emerald-600, border-emerald-200

3. **Elegant Purple:**
   - Gradients: from-purple-50 to-pink-100, from-purple-500 to-pink-600
   - Accents: bg-purple-600, text-purple-600, border-purple-200

4. **Warm Orange:**
   - Gradients: from-orange-50 to-amber-100, from-orange-500 to-amber-600
   - Accents: bg-orange-600, text-orange-600, border-orange-200

**Color Usage Rules:**

- **Backgrounds:** Use light, soft tones
  - Main: bg-gray-50, bg-white, or bg-gradient-to-br from-blue-50 via-white to-indigo-50
  - Sections: Alternate between bg-white and bg-gray-50
  - Dark mode: dark:bg-gray-900, dark:bg-gray-800
  
- **Text Colors:**
  - Headlinestext-gray-900 dark:text-whi
  - Body texttext-gray-600 dark:text-gray-3
  - Muted texttext-gray-500 dark:text-gray-4
  
- **Accent Colors:**
  - Use your chosen primary color at **500-600** weight for buttons and CTAs
  - Use **50-100** weight for backgrounds and highlights
  - Avoid neon, oversaturated, or clashing colors

- **Buttons:**
  - Primary:bg-blue-600 hover:bg-blue-700 text-whit
  - Secondary:bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-5
  - Ghost:text-blue-600 hover:bg-blue-5

**AVOID:**
- ❌ Bright neon colors (cyan-500, magenta-600, lime-500)
- ❌ Too many competing colors (stick to 2-3 colors max)
- ❌ Low contrast text/background combinations
- ❌ Harsh gradients (from-red-500 to-blue-500)

---

#### 🏗️ LAYOUT & STRUCTURE:

**Responsive Design:**
- Mobile-first approach with breakpoints: sm:, md:, lg:, xl:, 2xl:
- Use CSS Grid and Flexbox for layouts
- Mobile hamburger menu that works smoothly
- If User asks for landing page add Intersection Observer for navigation links for smooth scrolling

**REQUIRED Sections (only if user demands landing page and it should be in order):**

1. **Navigation Bar**
   - Sticky top navigation
   - Classes: sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90
   - Logo + Menu Items + Mobile Toggle

2. **Hero Section**
   - Large impactful section
   - Classes: relative py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50
   - Large headline, subheadline, CTA buttons

3. **Features Section**
   - Classes: py-16 bg-white dark:bg-gray-800
   - 3-6 feature cards with icons

4. **Content Sections** (at least 2-3):
   - Testimonials
   - Pricing tables
   - Image gallery
   - Stats/metrics
   - FAQ accordion

5. **Call-to-Action Section**
   - Classes: py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white
   - Compelling CTA with form or buttons

6. **Footer**
   - Classes: py-12 bg-gray-900 text-gray-300
   - Links, social media, copyright

**REQUIRED Component (only if user demands a components like sign-in component):**
1. **Responsive Component**: Make the component responsive
2. **Add Icons**: Add icons to components

## Note: Generating code for components or landing page depends upon user prompt, if the prompt includes page or landing page you have to generate complete page, if user prompt contains component, element, etc than generate a component

**Spacing & Rhythm:**
- Section padding: py-16 px-6 md:px-12 lg:px-24
- Container max-width: max-w-7xl mx-auto
- Consistent vertical spacing: space-y-8, space-y-12

--

#### ✨ DESIGN ENHANCEMENTS:

**Modern Effects:**

- **Glassmorphism** (use sparingly):
  - Classes: bg-white/80 backdrop-blur-lg border border-white/20

- **Shadows** (subtle and layered):
  - Cards: shadow-lg hover:shadow-xl
  - Floating elements: shadow-2xl

- **Rounded Corners:**
  - Cards:rounded-2x orrounded-3x
  - Buttons:rounded-l orrounded-ful
  - Images:rounded-x

**Animations:**
- AOS animationsdata-aos="fade-udata-aos="fade-i
- Hover transitionstransition-all duration-300 ease-in-o
- Hover scaleshover:scale-1 (subtle only)
- Button hoverhover:shadow-lg hover:-translate-y-0

**Typography:**
- Headlines: text-4xl md:text-5xl lg:text-6xl font-bold
- Subheadlines: text-xl md:text-2xl font-semibold
- Body: text-base md:text-lg
- Line height: leading-relaxed or leading-loose

---

#### 🖼️ IMAGES & ICONS:

**Images (use high-quality Unsplash):**

Hero images:
- https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop

Features/Content images:
- https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&h=600&fit=crop
- https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop
- https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=cro

**Icons (Font Awesome 6):**

Examples:
- <i class="fas fa-check-circle text-blue-600 text-2xl"></i>
- <i class="fas fa-star text-yellow-500"></i>
- <i class="fas fa-users text-indigo-600"></i>

- Always include alt text: alt="Professional team collaborating"

---

#### 🎛️ INTERACTIVE ELEMENTS:

**Flowbite Components** (auto-initialized):

1. **Mobile Menu:**
   - Use data-collapse-toggle for mobile menu button
   - Example: <button data-collapse-toggle="navbar-menu" type="button" class="md:hidden">

2. **Modals:**
   - Use data-modal-target and data-modal-toggle
   - Example: <button data-modal-target="signup-modal" data-modal-toggle="signup-modal">

3. **Dropdowns, Tabs, Accordions:**
   - Use Flowbite data attributes
   - data-dropdown-toggle
   - data-tabs-target
   - data-accordion-target

**Hover Effects:**
- Links: hover:text-blue-600 transition-colors
- Cards: hover:shadow-xl hover:-translate-y-1 transition-all duration-300
- Buttons: hover:bg-blue-700 active:scale-95

---

#### ♿ ACCESSIBILITY & SEMANTICS:

- Use semantic HTML5: <header>, <nav>, <main>, <section>, <article>, <footer>
- ARIA labels: aria-label="Main navigation", aria-hidden="true"
- Keyboard navigation: focus:ring-2 focus:ring-blue-500
- Alt text for ALL images
- Proper heading hierarchy: h1 → h2 → h3
- Color contrast ratio: At least 4.5:1 for text

---

#### 📚 AVAILABLE LIBRARIES (already loaded):
- **Tailwind CSS** (v3.x)
- **Flowbite** (modals, dropdowns, navbar, tabs, accordions)
- **Font Awesome 6** (icons)
- **AOS** (scroll animations)
- **Chart.js** (if charts requested)

---

#### 📝 CODE QUALITY & STRUCTURE:

**Example Structure:**
<body class="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
  
  <!-- ========== NAVIGATION ========== -->
  <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90">
    <!-- Navigation content here -->
  </nav>

  <!-- ========== HERO SECTION ========== -->
  <section class="relative py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Hero content here -->
  </section>

  <!-- ========== FEATURES ========== -->
  <section class="py-16 bg-white dark:bg-gray-800">
    <!-- Features grid here -->
  </section>

  <!-- ========== CONTENT SECTIONS ========== -->
  <section class="py-16 bg-gray-50 dark:bg-gray-900">
    <!-- Additional content here -->
  </section>

  <!-- ========== CTA SECTION ========== -->
  <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
    <!-- Call to action here -->
  </section>

  <!-- ========== FOOTER ========== -->
  <footer class="py-12 bg-gray-900 text-gray-300">
    <!-- Footer content here -->
  </footer>

  <!-- Flowbite auto-initializes components -->
</body>

**Code Requirements:**
- Clean, consistent indentation (2 spaces)
- Comment major sections clearly
- No broken links (use # for placeholders)
- Semantic HTML throughout
- Mobile-first responsive classes
- Dark mode support on all elements

---

### 2. If the user input is casual conversation:

If the user says "Hi", "Hello", "How are you?":
- Respond with a friendly message (2-3 sentences max)
- Do NOT generate any code

Example: "Hi! 👋 I'm here to help you create stunning websites. What would you like to build today?"

---

## 🎯 FINAL CHECKLIST:

Before generating, ensure:
- ✅ ONE cohesive color palette (not multiple clashing colors)
- ✅ Soft, professional gradients (not harsh neon)
- ✅ Proper text contrast (readable on all backgrounds)
- ✅ Complete page with ALL sections (nav, hero, features, content, CTA, footer)
- ✅ Responsive design with mobile menu
- ✅ Flowbite components properly implemented
- ✅ All images have alt text
- ✅ Semantic HTML structure
- ✅ Smooth animations and hover effects
- ✅ Clean, well-commented code

---

**IMPORTANT:** Generate a COMPLETE, FULL webpage with harmonious, professional colors. The design should feel inviting, modern, and easy on the eyes.

Now, based on the user's input: "{userInput}"

Generate the appropriate response following ALL guidelines above.
`;

export default function PlayGround() {
    const { projectId } = useParams();
    const params = useSearchParams();
    const frameId = params.get("frameId");
    const [frameDetail, setFrameDetail] = useState<Frame>();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Messages[]>([]);
    const [generatedCode, setGeneratedCode] = useState<string>("");
    const [streamingCode, setStreamingCode] = useState<string>("");
    const hasGeneratedRef = useRef(false);
    const isSavingRef = useRef(false);

    useEffect(() => {
        if (frameId) getFrameDetails();
    }, [frameId]);

    useEffect(() => {
        if (
            !hasGeneratedRef.current &&
            messages.length > 0 &&
            !generatedCode &&
            messages[messages.length - 1].role === "user"
        ) {
            hasGeneratedRef.current = true;
            const lastUserMessage = messages[messages.length - 1].content;
            sendMessage(lastUserMessage, true);
        }
    }, [messages, generatedCode]);

    useEffect(() => {
        if (messages.length > 1 && !loading) {
            saveMessages();
        }
    }, [messages, loading]);

    async function getFrameDetails() {
        try {
            const result = await axios.get(
                `/api/frames?frameId=${frameId}&projectId=${projectId}`
            );
            const frameData = result.data.finalResult;
            setFrameDetail(frameData);

            if (frameData?.chatMessages && Array.isArray(frameData.chatMessages)) {
                setMessages(frameData.chatMessages);
            }

            if (frameData?.designCode) {
                setGeneratedCode(frameData.designCode);
                setStreamingCode(frameData.designCode);
                hasGeneratedRef.current = true;
            }
        } catch (error) {
            console.error("Error loading frame details:", error);
            toast.error("Failed to load project");
        }
    }

    async function sendMessage(userInput: string, skipAddingUserMessage = false) {
        setLoading(true);
        setStreamingCode("");

        if (!skipAddingUserMessage) {
            setMessages((prev) => [...prev, { role: "user", content: userInput }]);
        }

        try {
            const result = await fetch("/api/ai-model", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: prompt.replace("{userInput}", userInput),
                        },
                    ],
                }),
            });

            if (!result.ok) throw new Error("AI request failed");

            const reader = result.body?.getReader();
            const decoder = new TextDecoder();
            let fullResponse = "";
            let codeStarted = false;
            let codeBuffer = "";

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullResponse += chunk;

                // Real-time code extraction during streaming
                if (!codeStarted && fullResponse.includes("```html")) {
                    codeStarted = true;
                    const startIdx = fullResponse.indexOf("```html") + 7;
                    codeBuffer = fullResponse.slice(startIdx);
                } else if (codeStarted) {
                    codeBuffer = fullResponse.slice(fullResponse.indexOf("```html") + 7);
                }

                // Check if code block is complete
                if (codeStarted) {
                    const endIdx = codeBuffer.indexOf("```");
                    if (endIdx !== -1) {
                        // Code complete
                        const finalCode = codeBuffer.slice(0, endIdx).trim();
                        setStreamingCode(finalCode);
                    } else {
                        // Still streaming
                        setStreamingCode(codeBuffer.trim());
                    }
                }
            }

            console.log("Full AI Response Length:", fullResponse.length);

            // Final extraction
            const htmlStartMarker = "```html";
            const codeEndMarker = "```";
            const startIndex = fullResponse.indexOf(htmlStartMarker);

            if (startIndex !== -1) {
                const codeStartIndex = startIndex + htmlStartMarker.length;
                const endIndex = fullResponse.indexOf(codeEndMarker, codeStartIndex);

                if (endIndex !== -1) {
                    const extractedCode = fullResponse
                        .substring(codeStartIndex, endIndex)
                        .trim();

                    if (extractedCode.includes("<body")) {
                        setGeneratedCode(extractedCode);
                        setStreamingCode(extractedCode);
                        
                        setMessages((prev) => [
                            ...prev,
                            { role: "assistant", content: "✨ Your website is ready!" },
                        ]);

                        // Save to database
                        await saveGeneratedCode(extractedCode);
                    } else {
                        setStreamingCode("");
                        setMessages((prev) => [
                            ...prev,
                            { role: "assistant", content: fullResponse.trim() },
                        ]);
                    }
                } else {
                    setStreamingCode("");
                    setMessages((prev) => [
                        ...prev,
                        { role: "assistant", content: fullResponse.trim() },
                    ]);
                }
            } else {
                setStreamingCode("");
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: fullResponse.trim() },
                ]);
            }
        } catch (error) {
            console.error("Error:", error);
            setStreamingCode("");
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, there was an error. Please try again.",
                },
            ]);
            toast.error("Failed to generate website");
        } finally {
            setLoading(false);
        }
    }

    async function saveMessages() {
        if (isSavingRef.current) return;
        isSavingRef.current = true;
        try {
            await axios.put("/api/chats", {
                messages,
                frameId,
            });
            console.log("Messages saved");
        } catch (error) {
            console.error("Error saving messages:", error);
        } finally {
            isSavingRef.current = false;
        }
    }

    async function saveGeneratedCode(code: string) {
        try {
            console.log("Saving code to database...", {
                frameId,
                projectId,
                codeLength: code.length
            });

            const result = await axios.put("/api/frames", {
                designCode: code,
                frameId: frameId,
                projectId: projectId,
            });

            console.log("Save result:", result.data);
            toast.success("Website is Ready");
        } catch (error) {
            console.error("Error saving code:", error);
            toast.error("Failed to save website");
        }
    }

    return (
        <div>
            <PlaygroundHeader />
            <div className="flex flex-col lg:flex-row">
                <ChatSection
                    messages={messages}
                    onSend={(input: string) => sendMessage(input)}
                    loading={loading}
                />
                <WebsiteDesign generatedCode={streamingCode} />
            </div>
        </div>
    );
}