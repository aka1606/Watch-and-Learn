import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import CreateSalon from "./createSalon";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createSalon" element={<CreateSalon />} />
      </Routes>
    </Router>
  );
}

export default App;
