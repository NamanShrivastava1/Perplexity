import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import remarkGfm from "remark-gfm";
import { Plus, Send, MessageCircle, Menu, User, LogOut } from "lucide-react";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSubmitMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  const handleNewChat = () => {
    // Clear current chat ID to start fresh
    setChatInput("");
    // This will trigger creating a new chat when first message is sent
    // The Redux store will handle creating the new chat via handleSendMessage
  };

  return (
    <main className="min-h-screen w-full bg-gray-50 text-gray-900 overflow-hidden">
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-in-up {
          animation: slideInUp 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .message-item {
          animation: slideInUp 0.3s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="flex h-screen gap-0">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-72" : "w-0"
          } transition-all duration-300 ease-in-out flex flex-col bg-white border-r border-gray-200 overflow-hidden md:w-72 md:static`}
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center">
                <MessageCircle size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Veracity Ai</h1>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2.5 px-4 transition-all duration-200 font-semibold text-sm shadow-sm hover:shadow-md"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat History */}
          <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 space-y-1.5">
            {Object.values(chats).map((chat, index) => (
              <button
                onClick={() => {
                  openChat(chat.id);
                }}
                key={index}
                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium truncate ${
                  chat.id === currentChatId
                    ? "bg-gray-200 text-gray-900 border border-gray-300"
                    : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-150"
                }`}
              >
                {chat.title}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              © 2026 Veracity
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">
          {/* Header */}
          <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={20} className="text-gray-700" />
              </button>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {chats[currentChatId]?.title || "New Chat"}
                </h2>
              </div>
            </div>
            
            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:shadow-md transition-all duration-200"
              >
                <User size={18} className="text-white" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 animate-fade-in">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors">
                    <User size={16} />
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors border-t border-gray-200 mt-1 pt-2">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="flex flex-col h-full px-4 md:px-8 py-6 space-y-4 max-w-4xl mx-auto w-full">
              {chats[currentChatId]?.messages?.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-3 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                    <MessageCircle size={28} className="text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Start a conversation
                  </h3>
                  <p className="text-gray-500 max-w-md text-sm">
                      Ask anything and get intelligent responses
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chats[currentChatId]?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      } message-item`}
                    >
                      <div
                        className={`max-w-2xl rounded-2xl px-4 py-3 text-sm md:text-base leading-relaxed ${
                          message.role === "user"
                            ? "bg-gray-800 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200"
                        }`}
                      >
                        {message.role === "user" ? (
                          <p>{message.content}</p>
                        ) : (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="mb-2 list-disc pl-5 space-y-1">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="mb-2 list-decimal pl-5 space-y-1">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-gray-100">{children}</li>
                              ),
                              code: ({ children }) => (
                                <code className="rounded bg-gray-700 px-2 py-1 text-gray-200 font-mono text-xs">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="mb-2 overflow-x-auto rounded-lg bg-gray-900 p-4 border border-gray-700">
                                  <code className="text-gray-200">{children}</code>
                                </pre>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-lg font-bold mb-2 text-gray-800">
                                  {children}
                                </h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-base font-bold mb-2 text-gray-800">
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-sm font-bold mb-2 text-gray-800">
                                  {children}
                                </h3>
                              ),
                            }}
                            remarkPlugins={[remarkGfm]}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <footer className="border-t border-gray-200 bg-white p-4 md:p-6">
            <form
              onSubmit={handleSubmitMessage}
              className="max-w-4xl mx-auto"
            >
              <div className="flex gap-3 items-end">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="rounded-lg bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 px-4 py-2.5 text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
