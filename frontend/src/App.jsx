import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";

// Page Elements
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Feed from './pages/Feed.jsx'
import Conversation from './pages/Conversation.jsx'
import CreatePost from './pages/CreatePost.jsx'
import Messages from './pages/Messages.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={
        <PrivateRoute>
          <Feed />
        </PrivateRoute>
      } />
      <Route path="/create" element={
        <PrivateRoute>
          <CreatePost />
        </PrivateRoute>
      } />
      <Route path="/messages" element={
        <PrivateRoute>
          <Messages />
        </PrivateRoute>
      } />
      <Route path="/messages/:id" element={
        <PrivateRoute>
          <Conversation />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
