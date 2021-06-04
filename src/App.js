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
        </Fragment>
    );
}

export default App;
