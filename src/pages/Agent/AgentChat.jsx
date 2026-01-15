// pages/Agent/AgentChat.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { listProducts } from "../../services/ProductsService";
import styles from "./AgentChat.module.css";

export default function AgentChat() {
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load all products once
  useEffect(() => {
    const allProducts = listProducts();
    setProducts(allProducts);
  }, []);

  // Handle initial message from landing page
  useEffect(() => {
    if (location.state?.initialMessage) {
      const initialMsg = location.state.initialMessage;
      // Clear the state so it doesn't re-trigger
      window.history.replaceState({}, document.title);
      // Send the initial message
      setTimeout(() => {
        sendMessage(initialMsg);
      }, 100);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleDraftChange = (e) => {
    const value = e.target.value;
    setDraft(value);

    if (inputRef.current) {
      inputRef.current.style.height = "0px";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  };

  // Extract product IDs from AI response [product:id]
  const extractProductIds = (text) => {
    const regex = /\[product:([^\]]+)\]/g;
    const ids = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      ids.push(match[1]);
    }
    return ids;
  };

  // Remove product tags from display text
  const cleanResponseText = (text) => {
    return text.replace(/\[product:[^\]]+\]/g, '').trim();
  };

  // Send message to AI
  const sendMessage = async (text) => {
    const userText = text || draft.trim();
    if (!userText || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText,
    };

    const assistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      isLoading: true,
      productIds: [],
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDraft("");
    setIsLoading(true);

    if (inputRef.current) {
      inputRef.current.style.height = "44px";
    }

    try {
      // Build conversation history for context
      const conversationHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.content;
      const productIds = extractProductIds(aiContent);
      const cleanContent = cleanResponseText(aiContent);

      // Update the assistant message with the response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: cleanContent, isLoading: false, productIds }
            : m
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
                isLoading: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  const getProductById = (id) => products.find((p) => p.id === id);

  return (
    <>
      <div className={styles.chatColumn}>
        <div className={styles.messagesList}>
          <div className={styles.messagesInner}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <h2>Welcome to Amulet AI</h2>
                <p>I'm Dr. Alex, your longevity physician. How can I help you today?</p>
              </div>
            )}

            {messages.map((m) =>
              m.role === "user" ? (
                <div className={styles.userBubble} key={m.id}>
                  <div className={styles.frame3}>
                    <p className={styles.shopSupplements4}>{m.content}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.assistantBubble} key={m.id}>
                  <div className={styles.frame2}>
                    {m.isLoading ? (
                      <div className={styles.loadingDots}>
                        <span>●</span><span>●</span><span>●</span>
                      </div>
                    ) : (
                      <>
                        <div className={styles.markdownContent}>
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>

                        {/* Product recommendations */}
                        {m.productIds && m.productIds.length > 0 && (
                          <div className={styles.productsList}>
                            {m.productIds.map((pid) => {
                              const product = getProductById(pid);
                              if (!product) return null;
                              return (
                                <div key={product.id} className={styles.productCard}>
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className={styles.productImage}
                                  />
                                  <div className={styles.productMeta}>
                                    <div className={styles.productName}>{product.name}</div>
                                    <div className={styles.productPrice}>
                                      ${product.price.toFixed(2)}
                                    </div>
                                    <p className={styles.bodyCopyDescription}>
                                      {product.description}
                                    </p>
                                    <p className={styles.bodyCopyCategory}>
                                      {product.category} · {product.status}
                                    </p>
                                    <div className={styles.productActions}>
                                      <button
                                        type="button"
                                        className={styles.iconButton}
                                        aria-label={`View details for ${product.name}`}
                                        onClick={() => handleViewProduct(product)}
                                      >
                                        <img
                                          src="/assets/eyelink.svg"
                                          alt=""
                                          className={styles.actionIcon}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className={styles.composer}>
        <textarea
          ref={inputRef}
          aria-label="Message"
          className={styles.inputText}
          placeholder={isLoading ? "Dr. Alex is typing..." : "Describe your health concern..."}
          value={draft}
          rows={1}
          onChange={handleDraftChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={isLoading}
        />

        <div className={styles.composerActions}>
          <button
            className={styles.sendButton}
            onClick={() => sendMessage()}
            aria-label="Send"
            disabled={!draft.trim() || isLoading}
          >
            <img
              className={styles.icon24}
              src="/assets/send.svg"
              alt="Send"
            />
          </button>
        </div>
      </div>
    </>
  );
}
