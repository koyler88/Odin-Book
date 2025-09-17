import { Route, Routes } from "react-router-dom";

// Page Elements
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
