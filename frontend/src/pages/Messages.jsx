import "../styles/Messages.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function Messages() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    // Fetch all messages for the user and group by conversation
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get("http://localhost:3000/messages", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                // Group messages by other user
                const grouped = {};
                res.data.forEach((msg) => {
                    const other = msg.author.id === user.id ? msg.recipient : msg.author;
                    if (!grouped[other.id]) grouped[other.id] = { user: other, messages: [] };
                    grouped[other.id].messages.push(msg);
                });
                // Sort by last message
                const convos = Object.values(grouped).sort(
                    (a, b) =>
                        new Date(
                            b.messages[b.messages.length - 1].createdAt
                        ) -
                        new Date(a.messages[a.messages.length - 1].createdAt)
                );
                setConversations(convos);
                } catch {
                    // ignore
            }
        };
        if (user) fetchConversations();
    }, [user]);

    // Fetch profile for bottom nav
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`http://localhost:3000/users/me`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setProfile(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
        fetchProfile();
    }, [user]);

    // Search users to start new conversation
    useEffect(() => {
        if (!search) {
            setSearchResults([]);
            return;
        }
        const fetch = setTimeout(async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/users/search?username=${search}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setSearchResults(res.data.filter((u) => u.id !== user.id));
            } catch (err) {
                console.error("Error searching users:", err);
            }
        }, 300);
        return () => clearTimeout(fetch);
    }, [search, user]);

    return (
        <div className="messages-container">
            <header className="messages-header">
                <h2>Direct</h2>
                <input
                    className="messages-search"
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                        {search && searchResults.length > 0 && (
                            <ul className="messages-search-results">
                                {searchResults.map((u) => (
                                    <li
                                        key={u.id}
                                        onClick={() => navigate(`/messages/${u.id}`)}
                                        className="messages-search-result"
                                    >
                                        <img
                                            src={u.profile?.avatarUrl || "https://picsum.photos/32"}
                                            alt={u.username}
                                            className="messages-avatar"
                                        />
                                        <span>{u.username}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
            </header>
            <main className="messages-list">
                {conversations.length === 0 && (
                    <div className="no-convos">No conversations yet.</div>
                )}
                {conversations.map((c) => {
                    const lastMsg = c.messages[c.messages.length - 1];
                    return (
                        <Link
                            to={`/messages/${c.user.id}`}
                            className="messages-list-item"
                            key={c.user.id}
                        >
                            <img
                                src={c.user.profile?.avatarUrl || "https://picsum.photos/40"}
                                alt={c.user.username}
                                className="messages-avatar"
                            />
                            <div className="messages-list-info">
                                <span className="messages-list-username">{c.user.username}</span>
                                <span className="messages-list-preview">
                                    {lastMsg.author.id === user.id ? "You: " : ""}
                                    {lastMsg.content.length > 32
                                        ? lastMsg.content.slice(0, 32) + "..."
                                        : lastMsg.content}
                                </span>
                            </div>
                            <span className="messages-list-date">
                                {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </Link>
                    );
                })}
            </main>
            {/* Bottom Nav */}
            <nav className="bottom-nav">
                <Link to="/feed" className="nav-item">
                    🏠
                </Link>
                <Link to="/create" className="nav-item">
                    ➕
                </Link>
                <Link to="/messages" className="nav-item active">
                    💬
                </Link>
                <Link to="/profile" className="nav-item">
                    <img
                        src={profile?.avatarUrl || "https://picsum.photos/28"}
                        alt="profile"
                        className="nav-avatar"
                    />
                </Link>
            </nav>
        </div>
    );
}