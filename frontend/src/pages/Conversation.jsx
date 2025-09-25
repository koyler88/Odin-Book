import "../styles/Messages.css";
import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function Conversation() {
    const { user } = useAuth();
    const { id } = useParams(); // id of the other user
    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState(null);
    const [input, setInput] = useState("");
    const [profile, setProfile] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Fetch conversation
    const fetchConversation = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3000/messages/conversations/${id}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setMessages(res.data);
            // Always fetch the other user's profile for the avatar
            let otherUserId = Number(id);
            let otherUsername = "";
            if (res.data.length > 0) {
                const first = res.data[0];
                const other = first.author.id === user.id ? first.recipient : first.author;
                otherUserId = other.id;
                otherUsername = other.username;
            }
            // Fetch profile for avatar
            let avatarUrl = undefined;
            try {
                const userRes = await axios.get(
                    `http://localhost:3000/users/${otherUserId}/profile`
                );
                avatarUrl = userRes.data.avatarUrl;
                if (!otherUsername) otherUsername = userRes.data.user.username;
            } catch (error) {
                console.log(error)
            }
            setOtherUser({
                id: otherUserId,
                username: otherUsername,
                profile: { avatarUrl },
            });
        } catch (err) {
            // If 404, show empty messages but fetch user profile for display
            if (err.response && err.response.status === 404) {
                let avatarUrl = undefined;
                let otherUsername = "";
                try {
                    const userRes = await axios.get(
                        `http://localhost:3000/users/${id}/profile`
                    );
                    avatarUrl = userRes.data.avatarUrl;
                    otherUsername = userRes.data.user.username;
                } catch (error) {
                    console.log(error);
                }
                setMessages([]);
                setOtherUser({
                    id: Number(id),
                    username: otherUsername,
                    profile: { avatarUrl },
                });
            } else {
                setMessages([]);
                setOtherUser(null);
            }
        }
    };
    useEffect(() => {
        if (user && id) fetchConversation();
        // eslint-disable-next-line
    }, [user, id]);

    // Fetch profile for bottom nav
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`http://localhost:3000/users/me`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setProfile(res.data);
                    } catch {
                        // ignore
                    }
        };
        fetchProfile();
    }, [user]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        try {
            await axios.post(
                "http://localhost:3000/messages",
                {
                    recipientId: id,
                    content: input,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );
            setInput("");
            // Refetch conversation after sending
            fetchConversation();
        } catch {
            alert("Failed to send message");
        }
    };

    // Delete message (only own)
    const deleteMessage = async (msgId) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await axios.delete(`http://localhost:3000/messages/${msgId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMessages((prev) => prev.filter((m) => m.id !== msgId));
            } catch {
                alert("Failed to delete message");
            }
    };

    if (!otherUser) {
        return (
            <div className="conversation-container">
                <header className="conversation-header">
                    <button className="back-btn" onClick={() => navigate("/messages")}>←</button>
                    <span>Conversation</span>
                </header>
                <div className="no-convos">No conversation found.</div>
                {/* Bottom Nav */}
                <nav className="bottom-nav">
                    <Link to="/feed" className="nav-item">🏠</Link>
                    <Link to="/create" className="nav-item">➕</Link>
                    <Link to="/messages" className="nav-item active">💬</Link>
                    <Link to="/profile" className="nav-item">
                        <img src={profile?.avatarUrl || "https://picsum.photos/28"} alt="profile" className="nav-avatar" />
                    </Link>
                </nav>
            </div>
        );
    }

    return (
        <div className="conversation-container">
            <header className="conversation-header">
                <button className="back-btn" onClick={() => navigate("/messages")}>←</button>
                <img
                    src={otherUser.profile?.avatarUrl || "https://picsum.photos/32"}
                    alt={otherUser.username}
                    className="messages-avatar"
                />
                <span className="conversation-username">{otherUser.username}</span>
            </header>
            <main className="conversation-messages">
                {messages.length === 0 && (
                    <div className="no-convos">No messages yet. Say hi!</div>
                )}
                {messages.map((msg) => {
                    // Defensive: skip if author or author.id is missing
                    if (!msg.author || typeof msg.author.id === 'undefined') return null;
                    return (
                        <div
                            key={msg.id}
                            className={
                                msg.author.id === user.id
                                    ? "message-bubble me"
                                    : "message-bubble"
                            }
                            onDoubleClick={() =>
                                msg.author.id === user.id ? deleteMessage(msg.id) : null
                            }
                            title={
                                msg.author.id === user.id
                                    ? "Double click to delete"
                                    : undefined
                            }
                        >
                            <span className="message-content">{msg.content}</span>
                            <span className="message-date">
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>
            <div style={{ position: "relative" }}>
                <form className="conversation-input" onSubmit={sendMessage} autoComplete="off" style={{ position: "fixed", left: 0, right: 0, bottom: 56, zIndex: 101, background: "#232323" }}>
                    <input
                        type="text"
                        placeholder="Message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoFocus
                    />
                    <button type="submit">Send</button>
                </form>
                {/* Bottom Nav */}
                <nav className="bottom-nav">
                    <Link to="/feed" className="nav-item">🏠</Link>
                    <Link to="/create" className="nav-item">➕</Link>
                    <Link to="/messages" className="nav-item active">💬</Link>
                    <Link to="/profile" className="nav-item">
                        <img src={profile?.avatarUrl || "https://picsum.photos/28"} alt="profile" className="nav-avatar" />
                    </Link>
                </nav>
            </div>
        </div>
    );
}