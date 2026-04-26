import { useRef, useState } from "react";
import { Plus, Send, X } from "lucide-react";

interface ChatComposerProps {
  onSend: (content: string, imageUrl?: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

export function ChatComposer({ onSend, onStop, isStreaming }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = () => {
    if ((!text.trim() && !image) || isStreaming) return;
    onSend(text, image || undefined);
    setText("");
    setImage(null);
    
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Auto-resize the textarea as the user types
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    // Increased max height to 250px before scrolling kicks in
    e.target.style.height = `${Math.min(e.target.scrollHeight, 250)}px`; 
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-8 pb-8">
      {/* Image Preview Area */}
      {image && (
        <div className="relative w-28 h-28 mb-4 border rounded-xl overflow-hidden bg-muted shadow-md transition-all animate-in zoom-in duration-200">
          <img src={image} alt="Upload preview" className="object-cover w-full h-full" />
          <button
            onClick={() => setImage(null)}
            className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 hover:scale-105 active:scale-95 backdrop-blur-sm transition-all"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upgraded Composer Box - Increased outer padding (p-2) */}
      <div className="relative flex items-end w-full border rounded-2xl bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all p-2">
        
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        
        {/* Attach Button - Added rotation, scaling, and colored hover state */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 mb-0.5 text-muted-foreground transition-all duration-200 ease-out rounded-xl hover:scale-110 hover:-rotate-12 active:scale-95 active:rotate-0"
          title="Attach image"
        >
          <Plus size={28} />
        </button>

        {/* Auto-resizing Textarea - Increased padding and minimum height */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Message Aegis Guard... (Shift+Enter for new line)"
          rows={1}
          className="flex-1 py-4 px-4 min-h-[60px] bg-transparent outline-none border-none placeholder:text-muted-foreground resize-none overflow-y-auto text-[17px] leading-relaxed"
        />

        {/* Send/Stop Button - Enhanced shadow and scale physics */}
        <button
          onClick={isStreaming ? onStop : handleSend}
          className={`p-3 mb-0.5 mx-1 rounded-xl transition-all duration-200 ease-out ${
            text.trim() || image
              ? "text-white bg-primary shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              : "text-muted-foreground bg-transparent hover:bg-muted"
          }`}
        >
          <Send size={26} className={text.trim() || image ? "ml-0.5" : ""} />
        </button>
      </div>

      <p className="text-sm text-center text-muted-foreground mt-4 font-medium tracking-wide opacity-80">
        Aegis scans every prompt and response across three guardrail gates.
      </p>
    </div>
  );
}