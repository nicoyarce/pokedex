import "./App.css";
import Pokedex from "./components/Pokedex";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
    return (
        <ErrorBoundary>
            <div className="titulo">
                <div className="texto-titulo">Pokedex de Nicoyarce</div>
            </div>
            <div className="pokedex-wrapper">
                <Pokedex />
            </div>
            <div className="navbar">
                <a
                    href="https://nicoyarce.github.io/me/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Creado por Nicoyarce
                </a>
            </div>
        </ErrorBoundary>
    );
}

export default App;
