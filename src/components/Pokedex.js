import axios from "axios";
import { useState, useEffect } from "react";
import DescripcionPokemon from "./DescripcionPokemon";
import PantallaPrincipal from "./PantallaPrincipal";
import MiniPantalla from "./MiniPantalla";
import TipoPokemon from "./TipoPokemon";

const Pokedex = () => {
    const [busqueda, setBusqueda] = useState("");
    const [inputPokemon, setInputPokemon] = useState("");
    const [nroActual, setNroActual] = useState(0);
    const [pkmnActual, setPkmnActual] = useState({});
    const [datosExtraPoke, setDatosExtraPoke] = useState({});
    const [descripcionPoke, setDescripcionPoke] = useState("?");
    const [totalPokemon, setTotalPokemon] = useState(0);

    useEffect(() => {
        consultaTotalPokemon();
        consultaPokemon();
    }, [busqueda]);

    const limpiaDescripcion = (str) => {
        if (typeof str !== "undefined") {
            let string = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return string.replace(/[\n\r]/g, " ");
        } else {
            return "";
        }
    };

    const consultaTotalPokemon = async () => {
        const url = `https://pokeapi.co/api/v2/pokemon-species`;
        const resultado = await axios.get(url);
        setTotalPokemon(resultado.data.count);
    };

    const consultaPokemon = async () => {
        if (busqueda !== "") {
            const url = `https://pokeapi.co/api/v2/pokemon/${busqueda}`;
            const url2 = `https://pokeapi.co/api/v2/pokemon-species/${busqueda}`;
            axios
                .all([axios.get(url), axios.get(url2)])
                .then(
                    axios.spread((...responses) => {
                        setPkmnActual(responses[0].data);
                        setInputPokemon(responses[0].data.name);
                        setNroActual(responses[0].data.id);

                        let stringDescripcion = `#${responses[0].data.id}
                    ${consultaDescipcionPoke(
                        responses[1].data.flavor_text_entries
                    )}`;
                        setDescripcionPoke(stringDescripcion);
                        setDatosExtraPoke(responses[1].data);
                    })
                )
                .catch((errors) => {
                    setPkmnActual({});
                    setInputPokemon("");
                    setNroActual(0);
                    setDatosExtraPoke({});
                    setDescripcionPoke("Pokemon no encontrado");
                });
        }
    };

    const consultaDescipcionPoke = (flavor_text_entries) => {
        if (typeof flavor_text_entries !== "undefined") {
            const lista_descripciones = flavor_text_entries.filter(
                (entrada) => entrada.language.name === "es"
            );
            let stringDescripcion = limpiaDescripcion(
                lista_descripciones[0]?.flavor_text
            );
            if (stringDescripcion === "") {
                return "No hay descripcion para este Pokemon.";
            } else {
                return stringDescripcion;
            }
        }
        return "";
    };

    const clickCruceta = (direccion) => {
        let nroTemp = nroActual;
        switch (direccion) {
            case "izq":
                nroTemp -= 1;
                break;
            case "arriba":
                nroTemp -= 10;
                break;
            case "abajo":
                nroTemp += 10;
                break;
            case "der":
                nroTemp += 1;
                break;
            default:
                break;
        }
        if (nroTemp <= 0 || nroTemp > totalPokemon) return;
        setNroActual(nroTemp);
        setBusqueda(nroTemp);
    };

    const clickBuscar = () => {
        setBusqueda(inputPokemon);
    };

    const reproducirAudio = (datosExtraPoke) => {
        let string = `${datosExtraPoke.name || ""},${consultaDescipcionPoke(
            datosExtraPoke.flavor_text_entries
        )}`;
        if (string !== ",") {
            const url = `https://api.voicerss.org/?key=${process.env.REACT_APP_VOICE_API_KEY}&f=11khz_16bit_stereo&b64=true&c=MP3&hl=es-es&src=${string}`;
            axios.get(url).then(function (response) {
                const audio = new Audio(response.data);
                audio.play();
            });
        }
    };
    return (
        <div className="pokedex">
            <div className="cuerpos">
                <div className="tapa-izq">
                    <div className="bordes">
                        <div className="borde-izq">
                            <div className="circulo-cristal"></div>
                            <div className="luz-circulo circulo-rojo"></div>
                            <div className="luz-circulo circulo-amarillo"></div>
                            <div className="luz-circulo circulo-verde"></div>
                        </div>
                        <div className="borde-izq-chico"></div>
                    </div>
                    <div className="marco-pantalla">
                        <PantallaPrincipal
                            pokemon={pkmnActual}
                        ></PantallaPrincipal>
                    </div>
                    <div className="grupo-botones-izq">
                        <button
                            className="boton-circulo circulo-izq"
                            onClick={() => clickBuscar()}
                        >
                            🔎
                        </button>
                        <MiniPantalla
                            inputPokemon={inputPokemon}
                            setInputPokemon={setInputPokemon}
                        ></MiniPantalla>
                        <div className="cruceta">
                            <button
                                className="boton-cruceta boton-cruceta-horizontal"
                                onClick={() => clickCruceta("izq")}
                            ></button>
                            <div className="cruceta-vertical">
                                <button
                                    className="boton-cruceta"
                                    onClick={() => clickCruceta("arriba")}
                                ></button>
                                <button
                                    className="boton-cruceta"
                                    onClick={() => clickCruceta("abajo")}
                                ></button>
                            </div>
                            <button
                                className="boton-cruceta boton-cruceta-horizontal"
                                onClick={() => clickCruceta("der")}
                            ></button>
                        </div>
                    </div>
                </div>
                <div className="medio"></div>
                <div className="tapa-der">
                    <div className="borde-der"></div>
                    <div className="interior-tapa-der">
                        <div className="pantalla pantalla-mediana">
                            <DescripcionPokemon
                                descripcion={descripcionPoke}
                            ></DescripcionPokemon>
                        </div>
                        <div className="grupo-botones-der">
                            <button className="boton-azul"></button>
                            <button className="boton-azul"></button>
                            <button className="boton-azul"></button>
                            <button className="boton-azul"></button>
                            <button className="boton-azul"></button>
                            <button className="boton-azul"></button>
                            <button className="boton-azul"></button>
                            <button className="boton-azul"></button>
                            <button className="boton-azul"></button>
                            <button className="boton-azul">
                                <span className="emoji">📏</span>
                            </button>
                        </div>
                        <div className="grupo-botones-finales">
                            <div className="grupo-botones-blanco">
                                <button className="boton-blanco"></button>
                                <button className="boton-blanco"></button>
                            </div>
                            <button
                                className="boton-circulo circulo-amarillo"
                                onClick={() => reproducirAudio(datosExtraPoke)}
                            >
                                🔊
                            </button>
                        </div>
                        <div className="grupo-pantallas-chicas">
                            <TipoPokemon
                                pokemon={pkmnActual}
                                slot={1}
                            ></TipoPokemon>

                            <TipoPokemon
                                pokemon={pkmnActual}
                                slot={2}
                            ></TipoPokemon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pokedex;
