import { Routes, Route } from "react-router-dom";
import GeneratePage from "./generate/page";
import LandingPage from "./home/page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/generate/:userId" element={<GeneratePage />} />
    </Routes>
  );
};

export default App;
