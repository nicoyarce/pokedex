import "./App.css";
import { Fragment } from "react";
import Pokedex from "./components/Pokedex";

function App() {
    return (
        <Fragment>
            <div className="titulo">
                <div className="texto-titulo">Pokedex de Nicoyarce</div>
            </div>
            <Pokedex></Pokedex>
            <div className="navbar">
                <a
                    href="https://nicoyarce.github.io/me/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Creado por Nicoyarce
                </a>
                <a
                    href="https://trello.com/b/a9n6v5QE/pokedex"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Trello - ToDo
                </a>
            </div>
        </Fragment>
    );
}

export default App;
