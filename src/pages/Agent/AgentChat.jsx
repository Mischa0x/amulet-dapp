// pages/Agent/AgentChat.jsx
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listProducts } from "../../services/ProductsService";
import styles from "./AgentChat.module.css";

const FOLLOWUP_TEXT =
  "Depending on your history, options may include sildenafil, tadalafil, hormone testing, sleep optimization, or therapy for stress and anxiety. ";

function buildAssistantReply(userText) {
  return (
    "Thank you for sharing that. A clinician would first assess underlying causes, then suggest safe, personalized treatment options tailored to your situation."
  );
}

const TOP_OFFSET_PX = 0; // controls where the latest prompt appears from the top

export default function AgentChat() {
  const [messages, setMessages] = useState([]); // empty on refresh
  const [edProducts, setEdProducts] = useState([]);
  const [draft, setDraft] = useState("");

  /**
   * typing = null or:
   * { id, field: "intro" | "followup", fullText, index }
   */
  const [typing, setTyping] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // "chat is rendering"

  const [latestUserId, setLatestUserId] = useState(null);

  const inputRef = useRef(null);
  const messagesListRef = useRef(null);
  const latestPromptRef = useRef(null);

  const intervalRef = useRef(null);
  const cardsTimeoutRef = useRef(null);
  const followupTimeoutRef = useRef(null);

  const navigate = useNavigate();

  // Load Erectile Dysfunction products once
  useEffect(() => {
    (async () => {
      try {
        const all = await listProducts();
        const edOnly = all.filter((p) => p.category === "Erectile Dysfunction");
        setEdProducts(edOnly);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    })();
  }, []);

  // Auto-resize textarea
  const handleDraftChange = (e) => {
    const value = e.target.value;
    setDraft(value);

    if (inputRef.current) {
      inputRef.current.style.height = "0px";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  };

  // Helper: clear all timers (typing + delayed cards/followup)
  const clearAllTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (cardsTimeoutRef.current) {
      clearTimeout(cardsTimeoutRef.current);
      cardsTimeoutRef.current = null;
    }
    if (followupTimeoutRef.current) {
      clearTimeout(followupTimeoutRef.current);
      followupTimeoutRef.current = null;
    }
  };

  // Typewriter effect (intro + followup)
  useEffect(() => {
    if (!typing) return;

    const { id, field, fullText } = typing;

    // already fully typed
    if (typing.index >= fullText.length) return;

    intervalRef.current = setInterval(() => {
      setTyping((prevTyping) => {
        if (!prevTyping || prevTyping.id !== id || prevTyping.field !== field) {
          return prevTyping;
        }

        const nextIndex = prevTyping.index + 1;
        const done = nextIndex >= prevTyping.fullText.length;
        const slice = prevTyping.fullText.slice(0, nextIndex);

        // update assistant message text
        setMessages((prevMsgs) =>
          prevMsgs.map((m) => {
            if (m.id !== id || m.role !== "assistant") return m;
            if (field === "intro") {
              return { ...m, intro: slice };
            } else {
              return { ...m, followup: slice };
            }
          })
        );

        if (done) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          if (field === "intro") {
            // 1️⃣ After 1s → show product cards
            cardsTimeoutRef.current = setTimeout(() => {
              setMessages((prevMsgs) =>
                prevMsgs.map((m) =>
                  m.id === id && m.role === "assistant"
                    ? { ...m, showCards: true }
                    : m
                )
              );
            }, 1000);

            // 2️⃣ After 4s → start followup
            followupTimeoutRef.current = setTimeout(() => {
              setTyping({
                id,
                field: "followup",
                fullText: FOLLOWUP_TEXT,
                index: 0,
              });
            }, 4000);
          } else {
            // followup finished → sequence done
            clearAllTimers();
            setIsPlaying(false);
          }
        }

        return { ...prevTyping, index: nextIndex };
      });
    }, 35);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [typing]);

  // 🔝 After messages & latestUserId update, move latest prompt to the very top
  useLayoutEffect(() => {
    if (!latestUserId) return;
    const container = messagesListRef.current;
    const el = latestPromptRef.current;
    if (!container || !el) return;

    // Distance from top of container’s content
    const offsetTop = el.offsetTop;

    container.scrollTo({
      top: Math.max(offsetTop - TOP_OFFSET_PX, 0),
      behavior: "auto",
    });
  }, [latestUserId, messages.length]);

  // Handle sending messages
  const send = () => {
    const text = draft.trim();
    if (!text) return;

    // 🚫 Prevent sending while chat is rendering
    if (isPlaying) {
      return;
    }

    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();
    const introText = buildAssistantReply(text);

    // Append new user + assistant at the bottom
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", text },
      {
        id: assistantId,
        role: "assistant",
        intro: "",
        followup: "",
        showCards: false,
      },
    ]);

    // Mark this prompt as "the one" to pin under the top
    setLatestUserId(userId);

    setDraft("");
    if (inputRef.current) {
      inputRef.current.style.height = "44px";
    }

    // Start typing animation for this assistant reply
    setIsPlaying(true);
    setTyping({
      id: assistantId,
      field: "intro",
      fullText: introText,
      index: 0,
    });
  };

  // Pause: cancel current rendering permanently, do NOT resume it
  const pauseRendering = () => {
    if (!isPlaying) return;
    clearAllTimers();
    setTyping(null);
    setIsPlaying(false);
  };

  // 🧭 Navigate to product page when clicking "View details"
  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <div className={styles.chatColumn}>
        <div className={styles.messagesList} ref={messagesListRef}>
          <div className={styles.messagesInner}>
            {messages.map((m) =>
              m.role === "user" ? (
                <div
                  className={styles.userBubble}
                  key={m.id}
                  ref={m.id === latestUserId ? latestPromptRef : null}
                >
                  <div className={styles.frame3}>
                    <p className={styles.shopSupplements4}>{m.text}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.assistantBubble} key={m.id}>
                  <div className={styles.frame2}>
                    {/* 1️⃣ First paragraph (typed) */}
                    <p className={styles.bodyCopy}>{m.intro || ""}</p>

                    {/* 2️⃣ Cards (appear 1s after intro finishes) */}
                    {m.showCards && edProducts.length > 0 && (
                      <div className={styles.productsList}>
                        {edProducts.map((p) => (
                          <div key={p.id} className={styles.productCard}>
                            <img
                              src={p.image}
                              alt={p.name}
                              className={styles.productImage}
                            />
                            <div className={styles.productMeta}>
                              <div className={styles.productName}>{p.name}</div>
                              <div className={styles.productPrice}>
                                ${p.price.toFixed(2)}
                              </div>
                              <p className={styles.bodyCopyDescription}>
                                {p.description}
                              </p>
                              <p className={styles.bodyCopyCategory}>
                                {p.category} · {p.status}
                              </p>

                              <div className={styles.productActions}>
                                <button
                                  type="button"
                                  className={styles.iconButton}
                                  aria-label={`View details for ${p.name}`}
                                  onClick={() => handleViewProduct(p)}
                                >
                                  <img
                                    src="/assets/eyelink.svg"
                                    alt=""
                                    className={styles.actionIcon}
                                  />
                                </button>
                                <button
                                  type="button"
                                  className={styles.iconButton}
                                  aria-label={`Add ${p.name} to cart`}
                                >
                                  <img
                                    src="/assets/cart.svg"
                                    alt=""
                                    className={styles.actionIcon}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 3️⃣ Second paragraph (typed after 4s) */}
                    {m.followup && (
                      <p className={styles.bodyCopy}>{m.followup}</p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className={styles.composer}>
        <textarea
          ref={inputRef}
          aria-label="Message"
          className={styles.inputText}
          placeholder={
            isPlaying
              ? "Assistant is responding… pause if you want to stop this answer."
              : "Describe your problem…"
          }
          value={draft}
          rows={1}
          onChange={handleDraftChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />

        <div className={styles.composerActions}>
          {/* 📎 Attach button */}
          <button
            type="button"
            className={styles.attachButton}
            disabled={!draft.trim()}
            onClick={() => {
              // TODO: open file picker or document modal
            }}
            aria-label="Attach document"
          >
            <img
              className={styles.icon208}
              src="/assets/attached.svg"
              alt="Attach"
            />
          </button>

          {/* Single button: send OR pause */}
          {isPlaying ? (
            <button
              type="button"
              className={styles.sendButton}
              onClick={pauseRendering}
              aria-label="Pause response"
            >
              {/* you can put a pause icon here if you want */}
            </button>
          ) : (
            <button
              className={styles.sendButton}
              onClick={send}
              aria-label="Send"
              disabled={!draft.trim()}
            >
              <img
                className={styles.icon24}
                src="/assets/send.svg"
                alt="Send"
              />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
