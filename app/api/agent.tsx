"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown, { Options } from "react-markdown";
import { getAuthHeaders } from '@/lib/auth/token-storage';

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AgentProps {
  apiEndpoint?: string;
  placeholder?: string;
  projectTitle?: string;
  projectDescription?: string;
  helpText?: string;
  className?: string;
  onError?: (error: Error) => void;
  onFinish?: (message: Message) => void;
}

// Utility function (cn)
const cn = (...inputs: (string | undefined | null | false)[]): string => {
  return inputs.filter(Boolean).join(" ");
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

// Loading Icon Component
const LoadingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

// Project Overview Component
const ProjectOverview = ({ 
  title, 
  description, 
  helpText 
}: { 
  title?: string; 
  description?: string; 
  helpText?: string; 
}) => {
  return (
    <motion.div
      className="w-full max-w-[600px] my-4"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-neutral-600 text-sm bg-gray-100 border-gray-200 dark:text-neutral-300 dark:border-neutral-600 dark:bg-gray-800">
        {/* <p>
          {title || (
            <>
              This AI chat assistant is powered by a custom{" "}
              <span className="text-blue-500 font-medium">agentic backend</span>{" "}
              built with{" "}
              <a
                href="https://langchain-ai.github.io/langgraph/"
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                LangGraph
              </a>
              . The frontend uses{" "}
              <a
                href="https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat"
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                useChat
              </a>{" "}
              hook to provide a seamless chat experience with your intelligent backend agents.
            </>
          )}
        </p>
        <p>
          {description || 
            "The backend handles complex agentic workflows including order tracking, customer support, and database queries. It can be easily extended to support more use cases."
          }
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {helpText || "💡 Try asking about order status, delivery tracking, or any customer service questions!"}
        </p> */}
        <p>
          {title || (
            <>
              Welcome to your AI customer service assistant! 📦 I help track{" "}
              <span className="text-blue-500 font-medium">any order</span>{" "}
              with real-time status, delivery location, and agent contact info.{" "}
              Try asking "Where is my order #25?" or "Contact for order #42" to see how I can help! 🚚
            </>
          )}
        </p>
        <p>
          {description || 
            "The backend handles complex agentic workflows including order tracking, customer support, and database queries. It can be easily extended to support more use cases."
          }
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {helpText || "💡 Try: 'Where is my order #15?' or 'Status of order 33' - Orders 1-50 available for demo!"}
        </p>
      </div>
    </motion.div>
  );
};
// Simple useChat hook implementation
const useChat = ({
  api,
  onError,
  onFinish,
}: {
  api: string;
  onError?: (error: Error) => void;
  onFinish?: (message: Message) => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => Math.random().toString(36).substring(7);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get authenticated headers using NextAuth session
      const headers = await getAuthHeaders();
      
      console.log("Making request to:", api);
      console.log("Request body:", {
        messages: [...messages, userMessage],
      });

      const response = await fetch(api, {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response body:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle JSON response
      const data = await response.json();
      console.log("Response data:", data);
      
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.content || data.response || data.message || "No response received",
      };

      setMessages(prev => [...prev, assistantMessage]);
      onFinish?.(assistantMessage);
    } catch (error) {
      console.error("Detailed error:", error);
      const errorMessage = error instanceof Error ? error : new Error("Unknown error");
      onError?.(errorMessage);
      
      // Add an error message to the chat
      const errorAssistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      };
      setMessages(prev => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  };
};

// Assistant Message Component
const AssistantMessage = ({ message }: { message: Message }) => {
  const MemoizedReactMarkdown: React.FC<Options> = React.memo(
    ReactMarkdown,
    (prevProps, nextProps) =>
      prevProps.children === nextProps.children
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="whitespace-pre-wrap font-mono text-sm text-neutral-800 dark:text-neutral-200 overflow-hidden"
        id="markdown"
      >
        <div className="max-h-72 overflow-y-scroll">
          <MemoizedReactMarkdown>
            {message.content}
          </MemoizedReactMarkdown>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Loading Component
const Loading = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring" }}
        className="overflow-hidden flex justify-start items-center"
      >
        <div className="flex flex-row gap-2 items-center">
          <div className="animate-spin dark:text-neutral-400 text-neutral-500">
            <LoadingIcon />
          </div>
          <div className="text-neutral-500 dark:text-neutral-400 text-sm">
            Thinking...
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Agent Component
const Agent: React.FC<AgentProps> = ({
  apiEndpoint = "/api/chat",
  placeholder = "Ask me anything...",
  projectTitle,
  projectDescription,
  helpText,
  className,
  onError,
  onFinish,
}) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      onError: onError || ((error) => {
        console.error("Chat error:", error);
      }),
      onFinish: onFinish || ((message) => {
        console.log("Chat finished with message:", message);
      }),
    });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (messages.length > 0) setIsExpanded(true);
  }, [messages]);

  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .slice(-1)[0];
  const lastAssistantMessage = messages
    .filter((m) => m.role === "assistant")
    .slice(-1)[0];

  return (
    <div className={cn(
      "w-full",
      className
    )}>
      <div className="flex flex-col items-center w-full max-w-[500px] mx-auto">
        <ProjectOverview 
          title={projectTitle}
          description={projectDescription}
          helpText={helpText}
        />
        <motion.div
          animate={{
            minHeight: isExpanded ? 200 : 0,
            padding: isExpanded ? 12 : 0,
          }}
          transition={{
            type: "spring",
            bounce: 0.5,
          }}
          className={cn(
            "rounded-lg w-full",
            isExpanded ? "bg-neutral-200 dark:bg-neutral-800" : "bg-transparent"
          )}
        >
          <div className="flex flex-col w-full justify-between gap-2">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                className="border rounded-lg bg-neutral-100 text-base w-full text-neutral-700 dark:bg-neutral-700 dark:placeholder:text-neutral-400 dark:text-neutral-300"
                minLength={3}
                required
                value={input}
                placeholder={placeholder}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </form>
            <motion.div
              transition={{
                type: "spring",
              }}
              className="min-h-fit flex flex-col gap-2"
            >
              <AnimatePresence>
                {isLoading ? (
                  <div className="px-2 min-h-12">
                    <div className="dark:text-neutral-400 text-neutral-500 text-sm w-fit mb-1">
                      {lastUserMessage?.content}
                    </div>
                    <Loading />
                  </div>
                ) : lastAssistantMessage ? (
                  <div className="px-2 min-h-12">
                    <div className="dark:text-neutral-400 text-neutral-500 text-sm w-fit mb-1">
                      {lastUserMessage?.content}
                    </div>
                    <AssistantMessage message={lastAssistantMessage} />
                  </div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Agent;