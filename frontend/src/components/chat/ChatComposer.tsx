import { useRef, useState } from "react";
import { Paperclip, Send, X } from "lucide-react";

interface ChatComposerProps {
  onSend: (content: string, imageUrl?: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

export function ChatComposer({ onSend, onStop, isStreaming }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert uploaded image to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = () => {
    if ((!text.trim() && !image) || isStreaming) return;
    onSend(text, image || undefined);
    setText("");
    setImage(null);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-8 pb-6">
      {/* Image Preview Area */}
      {image && (
        <div className="relative w-24 h-24 mb-3 border rounded-md overflow-hidden bg-muted">
          <img src={image} alt="Upload preview" className="object-cover w-full h-full" />
          <button
            onClick={() => setImage(null)}
            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="relative flex items-center w-full border rounded-lg bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-muted-foreground hover:text-foreground transition-colors"
          title="Attach image"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Message Aegis Guard... (Press Enter to send)"
          className="flex-1 py-3 px-2 bg-transparent outline-none border-none placeholder:text-muted-foreground"
        />

        <button
          onClick={isStreaming ? onStop : handleSend}
          className={`p-3 mx-1 rounded-md transition-colors ${
            text.trim() || image
              ? "text-white bg-primary hover:bg-primary/90"
              : "text-muted-foreground"
          }`}
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-xs text-center text-muted-foreground mt-2">
        Aegis scans every prompt and response across three guardrail gates.
      </p>
    </div>
  );
}