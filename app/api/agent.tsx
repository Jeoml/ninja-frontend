"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown, { Options } from "react-markdown";
import { toast } from 'sonner';

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
      className="w-full"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Customer Service Assistant
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {title || (
                <>
                  Welcome! 📦 I help track <span className="text-indigo-600 dark:text-indigo-400 font-medium">any order</span> with real-time status, delivery location, and agent contact info. Try asking "Where is my order with id 25?" or "Delivery person Contact for order with id 42" to see how I can help! 🚚
                </>
              )}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-full font-medium">
                Demo Mode
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Orders 1-50 available for testing
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
// Custom useChat hook with proper 429 handling
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
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      // Check for 429 rate limit specifically
      if (response.status === 429) {
        const errorData = await response.json();
        console.log("429 error data:", errorData);
        
        // Show toast with sign-in action
        toast.error('Rate limit exceeded!', {
          description: 'Please sign in to continue without restrictions.',
          // action: {
          //   label: 'Sign In',
          //   onClick: () => {
          //     window.location.href = '/';
          //   }
          // },
          duration: 10000, // Show for 10 seconds
        });
        
        return; // Don't add any message to chat
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.content || data.response || data.message || "No response received",
      };

      setMessages(prev => [...prev, assistantMessage]);
      onFinish?.(assistantMessage);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error : new Error("Unknown error");
      onError?.(errorMessage);
      
      // Show generic error toast
      toast.error('Something went wrong', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
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

// Message Components
const BotMessage = ({ message }: { message: Message }) => {
  const MemoizedReactMarkdown: React.FC<Options> = React.memo(
    ReactMarkdown,
    (prevProps, nextProps) =>
      prevProps.children === nextProps.children
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 mb-6"
    >
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-sm">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      
      {/* Message Content */}
      <div className="flex-1 max-w-[85%]">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed prose prose-sm max-w-none prose-p:my-1">
            <MemoizedReactMarkdown>
              {message.content}
            </MemoizedReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UserMessage = ({ message }: { message: Message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 mb-6 justify-end"
    >
      {/* Message Content */}
      <div className="flex-1 max-w-[85%] flex justify-end">
        <div className="bg-indigo-500 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
          <div className="text-sm text-white leading-relaxed">
            {message.content}
          </div>
        </div>
      </div>
      
      {/* User Avatar */}
      <div className="flex-shrink-0 w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center shadow-sm">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
    </motion.div>
  );
};

// Loading Component
const Loading = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 mb-6"
    >
      {/* Bot Avatar */}
      <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-sm">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      
      {/* Message Content */}
      <div className="flex-1 max-w-[85%]">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="animate-spin text-indigo-500">
              <LoadingIcon />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Thinking...
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Agent Component
const Agent: React.FC<AgentProps> = ({
  apiEndpoint = "https://ninja-production-8034.up.railway.app/ai-agents/langgraph/start-quiz",
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
      api: apiEndpoint,
      onError: onError || ((error) => {
        console.error("Chat error:", error);
      }),
      onFinish: onFinish || ((message) => {
        console.log("Chat finished with message:", message);
      }),
    });

  return (
    <div className={cn("w-full h-full flex flex-col bg-white dark:bg-gray-900", className)}>
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <ProjectOverview 
            title={projectTitle}
            description={projectDescription}
            helpText={helpText}
          />
        </div>
      )}
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          message.role === "assistant" ? (
            <BotMessage key={message.id} message={message} />
          ) : (
            <UserMessage key={message.id} message={message} />
          )
        ))}
        
        {/* Loading indicator */}
        {isLoading && <Loading />}
        
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              <p className="text-sm">Start a conversation by typing a message below</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            className="flex-1 border-2 rounded-xl bg-white dark:bg-gray-800 text-base text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all px-4 py-3"
            value={input}
            placeholder={placeholder}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center min-w-[60px] shadow-sm hover:shadow-md disabled:shadow-none"
          >
            {isLoading ? (
              <div className="animate-spin text-white">
                <LoadingIcon />
              </div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Agent;