import { Route, Routes } from "react-router-dom";

// Page Elements
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/messages/:id" element={<Conversation />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
