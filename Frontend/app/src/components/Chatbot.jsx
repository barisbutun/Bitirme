import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Input, List, Typography } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import { sendMessageToBot } from "../services/chatbotService";
import Draggable from "react-draggable";
import "../css/chatbot.css";

const CHAT_HISTORY_KEY = "chatbot_messages";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dragDisabled, setDragDisabled] = useState(false);
  const messageEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const loadHistory = () => {
    const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => {
      const updated = [...prev, userMessage];
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
    setInput("");

    try {
      const botResponse = await sendMessageToBot(input);
      const botMessage = {
        sender: "bot",
        text: botResponse.reply,
        image: botResponse.image || null,
      };
      setMessages((prev) => {
        const updated = [...prev, botMessage];
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
      };
      setMessages((prev) => {
        const updated = [...prev, errorMessage];
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  useEffect(() => {
    if (isOpen) loadHistory();
  }, [isOpen]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseLinks = (text) => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(linkRegex);

    return parts.map((part, index) =>
      linkRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1677ff", wordBreak: "normal" }}
        >
          {part}
        </a>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  };

  const handleMouseDown = () => {
    setDragDisabled(true);
  };

  const handleMouseUp = () => {
    setDragDisabled(false);
  };

  const ChatContent = (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Card
        className="chatbot-card"
        style={{
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: 500,
          width: 350,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          className="chatbot-header"
          style={{
            cursor: "move",
            padding: "10px 16px",
            color: "#797777",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Canlı Destek
          <Button
            type="text"
            icon={<CloseOutlined style={{ color: "#797777" }} />}
            onClick={toggleChatbot}
          />
        </div>

        <div
          className="chat-messages"
          style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}
        >
          <List
            dataSource={messages}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                className={item.sender === "user" ? "user-msg" : "bot-msg"}
                style={{
                  justifyContent:
                    item.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {item.sender === "user" ? (
                  <Typography.Text
                    style={{
                      fontWeight: "normal",
                      fontFamily: "Arial, sans-serif",
                      backgroundColor: "#fd702d",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 16,
                      maxWidth: "80%",
                      display: "inline-block",
                      wordBreak: "normal",
                      userSelect: "text",
                    }}
                  >
                    {parseLinks(item.text)}
                  </Typography.Text>
                ) : (
                  <div
                    style={{
                      fontWeight: "normal",
                      backgroundColor: "#f1f1f1",
                      color: "#000",
                      padding: "6px 12px",
                      borderRadius: 16,
                      maxWidth: "80%",
                      display: "inline-block",
                      wordBreak: "normal",
                      userSelect: "text",
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: item.text }} />
                    {item.image && (
                      <img
                        src={item.image}
                        alt="Ürün resmi"
                        style={{
                          marginTop: 8,
                          maxWidth: 150,
                          borderRadius: 8,
                          display: "block",
                        }}
                      />
                    )}
                  </div>
                )}
              </List.Item>
            )}
          />
          <div ref={messageEndRef} />
        </div>

        <div
          className="chatbot-input"
          style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f0" }}
        >
          <Input.Search
            placeholder="Mesaj yazın..."
            enterButton="Gönder"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSearch={handleSend}
            allowClear
          />
        </div>
      </Card>
    </div>
  );

  return (
    <>
      {isOpen && ChatContent}

      {!isOpen && (
        <Draggable>
          <div
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
          >
            <Button
              className="chatbot-button"
              type="primary"
              shape="circle"
              icon={<MessageOutlined />}
              size="large"
              onClick={toggleChatbot}
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#fd702d",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </Draggable>
      )}
    </>
  );
};

export default Chatbot;
