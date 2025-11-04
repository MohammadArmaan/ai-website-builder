import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { toast } from "sonner";

export function ViewCodeBlock({ children, code }: any) {
  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    toast.success("Code Copied!")
  }
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="w-min-lg md:min-w-3xl lg:min-w-7xl max-h-[500px] sm:max-h-[600px] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>
                          <div className="flex items-center gap-4">

                            Source Code{" "}
                            <span>
                                <Button onClick={handleCopy}>
                                    <Copy />
                                </Button>
                            </span>
                          </div>
                        </DialogTitle>
                        <DialogDescription asChild>
                            <div>
                                <SyntaxHighlighter>{code}</SyntaxHighlighter>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </form>
        </Dialog>
    );
}
