import HighlightMenu from "./components/HighlightMenu";
import Highlighter from "./components/Highlighter";
import Providers from "./providers";

export default function App() {
  return (
    <Providers>
      <Highlighter />
      <HighlightMenu />
    </Providers>
  );
}
