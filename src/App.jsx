import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Mask from "./pages/Mask";
import Processing from "./pages/Processing";
import Result from "./pages/Result";
import Audio from "./pages/Audio";
import  Compare  from "./pages/Compare";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/mask" element={<Mask />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/result" element={<Result />} />
      <Route path="/audio" element={<Audio />} />
      <Route path="/compare" element={<Compare />} /> {/* ✅ NEW ROUTE */}
    </Routes>
  );
}

export default App;
