import type { ChatMessage as ChatMessageType } from "@/types";
import { Copy, ThumbsUp, ThumbsDown, ShieldAlert } from "lucide-react";
import { useChatStore } from "@/store/chat.store";

interface Props {
  message: ChatMessageType;
  isLast: boolean;
  onRegenerate: () => void;
}

// CHANGED: Renamed from ChatMessageComponent to ChatMessage
export function ChatMessage({ message, isLast, onRegenerate }: Props) {
  const isUser = message.role === "user";
  const setReaction = useChatStore((s) => s.setReaction);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-6`}>
      <div className={`flex max-w-[85%] flex-col gap-2`}>
        
        {/* Render Attached Image */}
        {message.imageUrl && (
          <img 
            src={message.imageUrl} 
            alt="Attached content" 
            className="rounded-lg max-w-sm border shadow-sm" 
          />
        )}

        {/* Text Content */}
        {message.content && (
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : message.flagged
                ? "bg-red-50 text-red-900 border border-red-200 rounded-bl-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Assistant Action Bar */}
        {!isUser && !message.streaming && (
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            {message.flagged && (
              <span className="flex items-center text-xs text-red-600 font-medium mr-2">
                <ShieldAlert size={14} className="mr-1" />
                Intercepted (Score: {message.score?.toFixed(2)})
              </span>
            )}
            <button onClick={handleCopy} className="p-1 hover:text-foreground transition" title="Copy">
              <Copy size={14} />
            </button>
            <button 
              onClick={() => setReaction(message.id, message.reaction === "like" ? null : "like")}
              className={`p-1 transition ${message.reaction === "like" ? "text-green-600" : "hover:text-foreground"}`}
            >
              <ThumbsUp size={14} />
            </button>
            <button 
              onClick={() => setReaction(message.id, message.reaction === "dislike" ? null : "dislike")}
              className={`p-1 transition ${message.reaction === "dislike" ? "text-red-600" : "hover:text-foreground"}`}
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}