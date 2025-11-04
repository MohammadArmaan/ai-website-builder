import { useEffect, useState, useRef } from "react";
import { Messages } from "../[projectId]/page";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";

type Props = {
    messages: Messages[];
    onSend: (input: string) => void;
    loading?: boolean;
};

export default function ChatSection({ messages, onSend, loading }: Props) {
    const [input, setInput] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function handleSend() {
        if (!input?.trim() || loading) return;
        onSend(input);
        setInput("");
    }

    return (
        <div className="w-full lg:w-96 shadow dark:shadow-xl dark:border-b lg:dark:border-r h-[60vh] lg:h-[92vh] p-4 flex flex-col">
            {/* Message Section */}
            <div className="flex-1 overflow-y-auto space-y-3 flex flex-col">
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground text-center">
                            Start by describing the website you want to create
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    msg.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`p-3 rounded-lg max-w-[80%] ${
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-lg bg-muted text-foreground flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Generating...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Footer Input */}
            <div className="p-3 border rounded-xl mt-3 flex items-center gap-2">
                <textarea
                    value={input}
                    disabled={loading}
                    className="flex-1 resize-none rounded-lg px-3 py-3 focus:outline-none focus:ring-2 placeholder:text-muted-foreground placeholder:text-base disabled:opacity-50"
                    placeholder="Describe Your Website Design"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    rows={2}
                />
                <Button onClick={handleSend} disabled={loading || !input?.trim()}>
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <ArrowUp />
                    )}
                </Button>
            </div>
        </div>
    );
}