import RefiningCalculatorNew from "./components/RefiningCalculatorNew";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="bg-albion-dark text-albion-text font-body antialiased h-screen flex flex-col overflow-hidden selection:bg-primary selection:text-albion-dark">
      <Header />
      <RefiningCalculatorNew />
    </div>
  );
}

export default App;
