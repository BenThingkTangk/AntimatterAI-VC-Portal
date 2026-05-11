import { createRoot } from "react-dom/client";
import "@nirmata/dtom-brand-system/styles";
import App from "./App";
import "./index.css";

document.documentElement.classList.add('dark');

if (!window.location.hash) {
  window.location.hash = "#/";
}

createRoot(document.getElementById("root")!).render(<App />);
