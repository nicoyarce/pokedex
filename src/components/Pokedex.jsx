import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import DescripcionPokemon from "./DescripcionPokemon";
import PantallaPrincipal from "./PantallaPrincipal";
import MiniPantalla from "./MiniPantalla";
import TipoPokemon from "./TipoPokemon";
import Tooltip from "./Tooltip";
import ModalBienvenida from "./ModalBienvenida";
import BotonAyuda from "./BotonAyuda";
import { resolveVoiceApiKey, resolveVoiceLanguage, buildVoiceRssAudioUrl, getAudioSourceFromVoiceRssResponse } from "../utils/tts";

// Función helper para construir la cadena de evoluciones
const construirCadenaEvolucion = (chain) => {
    if (!chain?.species?.name) return [];
    
    // Extraer el ID de la URL: https://pokeapi.co/api/v2/pokemon-species/{id}/
    const urlParts = chain.species.url.split('/');
    const id = parseInt(urlParts[urlParts.length - 2], 10);
    
    const pokemonActual = {
        name: chain.species.name,
        id: id,
        url: chain.species.url,
        evolves_to: chain.evolves_to || []
    };
    
    if (chain.evolves_to && chain.evolves_to.length > 0) {
        const evolucionadas = chain.evolves_to.flatMap(construirCadenaEvolucion);
        return [pokemonActual, ...evolucionadas];
    }
    
    return [pokemonActual];
};

const Pokedex = () => {
    const [busqueda, setBusqueda] = useState("");
    const [inputPokemon, setInputPokemon] = useState("");
    const [nroActual, setNroActual] = useState(0);
    const [pkmnActual, setPkmnActual] = useState({});
    const [shiny, setShiny] = useState(false);
    const [datosExtraPoke, setDatosExtraPoke] = useState({});
    const [descripcionPoke, setDescripcionPoke] = useState("?");
    const [totalPokemon, setTotalPokemon] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pantallaModo, setPantallaModo] = useState("descripcion"); // "descripcion", "evoluciones", "info"
    const [evolucionData, setEvolucionData] = useState(null);
    const [loadingEvo, setLoadingEvo] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(() => {
        return !localStorage.getItem("pokedex-tutorial-visto");
    });
    const totalRef = useRef(0);

    const cerrarModal = useCallback(() => {
        setModalAbierto(false);
        localStorage.setItem("pokedex-tutorial-visto", "1");
    }, []);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            if (totalRef.current === 0) {
                try {
                    const res = await axios.get("https://pokeapi.co/api/v2/pokemon-species");
                    if (mounted) {
                        setTotalPokemon(res.data.count);
                        totalRef.current = res.data.count;
                    }
                } catch {
                    // Silently fail on init
                }
            }
        };

        init();

        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (busqueda !== "") {
            fetchPokemon();
        }
    }, [busqueda]);

    const limpiaDescripcion = useCallback((str) => {
        if (!str) return "";
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\n\r]/g, " ");
    }, []);

    const fetchPokemon = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [pokeRes, speciesRes] = await Promise.all([
                axios.get(`https://pokeapi.co/api/v2/pokemon/${busqueda}`),
                axios.get(`https://pokeapi.co/api/v2/pokemon-species/${busqueda}`)
            ]);

            const poke = pokeRes.data;
            const species = speciesRes.data;

            setPkmnActual(poke);
            setInputPokemon(poke.name);
            setNroActual(poke.id);
            setDatosExtraPoke(species);
            setPantallaModo("descripcion");

            // Fetch evolution chain
            if (species.evolution_chain) {
                fetchEvolucionChain(species.evolution_chain.url);
            }

            const esDesc = species.flavor_text_entries?.find(e => e.language.name === "es");
            const descText = limpiaDescripcion(esDesc?.flavor_text || "");

            setDescripcionPoke(descText
                ? `#${poke.id}\n${descText}`
                : "#\nNo hay descripción en español para este Pokémon."
            );
        } catch {
            setPkmnActual({});
            setInputPokemon("");
            setNroActual(0);
            setDatosExtraPoke({});
            setError("Pokémon no encontrado");
            setDescripcionPoke("Pokémon no encontrado");
        } finally {
            setLoading(false);
        }
    }, [busqueda, limpiaDescripcion]);

    const clickCruceta = useCallback((direccion) => {
        const total = totalRef.current || totalPokemon;
        let nroTemp = nroActual;

        switch (direccion) {
            case "izq": nroTemp -= 1; break;
            case "arriba": nroTemp -= 10; break;
            case "abajo": nroTemp += 10; break;
            case "der": nroTemp += 1; break;
            default: return;
        }

        if (nroTemp <= 0 || nroTemp > total) return;

        setNroActual(nroTemp);
        setBusqueda(nroTemp);
    }, [nroActual, totalPokemon]);

    const clickBuscar = useCallback(() => {
        if (inputPokemon.trim()) {
            setBusqueda(inputPokemon.trim());
        }
    }, [inputPokemon]);

    const reproducirAudio = useCallback((datos) => {
        const name = datos?.name || "";
        const esDesc = datos?.flavor_text_entries?.find(e => e.language.name === "es");
        const descText = limpiaDescripcion(esDesc?.flavor_text || "");

        const texto = [name, descText].filter(Boolean).join(", ");
        if (!texto.trim()) return;

        const apiKey = resolveVoiceApiKey(import.meta.env);
        if (!apiKey) {
            console.warn("Voice API key no configurada");
            return;
        }

        const language = resolveVoiceLanguage(import.meta.env);
        const url = buildVoiceRssAudioUrl({ apiKey, text: texto, language });
        if (!url) return;

        axios.get(url).then((response) => {
            const audioSource = getAudioSourceFromVoiceRssResponse(response.data);
            if (!audioSource) {
                console.warn("No se recibió audio válido de VoiceRSS");
                return;
            }

            const audio = new Audio(audioSource);
            audio.play().catch(() => { });
        }).catch((error) => {
            console.error("Error al reproducir audio:", error);
        });
    }, [limpiaDescripcion]);

    const toggleShiny = useCallback(() => {
        setShiny(prev => !prev);
    }, []);

    const clickGeneracion = useCallback(async (indexGen) => {
        // Generaciones van del 1 al 9
        const generacionNum = indexGen + 1;
        if (generacionNum < 1 || generacionNum > 9) return;

        try {
            const res = await axios.get(`https://pokeapi.co/api/v2/generation/${generacionNum}/`);
            const pokemonDeLaGen = res.data.pokemon_species;
            
            if (pokemonDeLaGen.length > 0) {
                // Obtiene el primer Pokémon de esa generación
                const pokemonPrimero = pokemonDeLaGen[0];
                setBusqueda(pokemonPrimero.name);
            }
        } catch (err) {
            console.error("Error al obtener generación:", err);
        }
    }, []);

    const fetchEvolucionChain = useCallback(async (url) => {
        try {
            setLoadingEvo(true);
            const res = await axios.get(url);

            const cadena = construirCadenaEvolucion(res.data.chain);
            setEvolucionData(cadena);
        } catch (err) {
            console.error("Error al obtener evoluciones:", err);
            setEvolucionData(null);
        } finally {
            setLoadingEvo(false);
        }
    }, []);

    const mostrarEvoluciones = useCallback(() => {
        setPantallaModo("evoluciones");
    }, []);

    const mostrarInfo = useCallback(() => {
        setPantallaModo("info");
    }, []);

    const mostrarDescripcion = useCallback(() => {
        setPantallaModo("descripcion");
    }, []);

    return (
        <div className="pokedex">
            {modalAbierto && <ModalBienvenida onClose={cerrarModal} />}
            <BotonAyuda onClick={() => setModalAbierto(true)} />
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
                        {loading && <div className="loading-overlay">⏳ Cargando...</div>}
                        <PantallaPrincipal
                            pokemon={pkmnActual}
                            shiny={shiny}
                        />
                        <Tooltip text="Efecto shiny" position="bottom">
                            <div
                                className="boton-circulo-pantalla circulo-rojo"
                                onClick={toggleShiny}
                            >✨</div>
                        </Tooltip>
                    </div>
                    <div className="grupo-botones-izq">
                        <Tooltip text="Buscar Pokémon" position="top">
                            <button
                                className="boton-circulo circulo-izq"
                                onClick={clickBuscar}
                                disabled={loading}
                            >
                                🔎
                            </button>
                        </Tooltip>
                        <MiniPantalla
                            inputPokemon={inputPokemon}
                            onChange={setInputPokemon}
                        />
                        <div className="cruceta">
                            <Tooltip text="Anterior (-1)" position="left">
                                <button
                                    className="boton-cruceta boton-cruceta-horizontal"
                                    onClick={() => clickCruceta("izq")}
                                ></button>
                            </Tooltip>
                            <div className="cruceta-vertical">
                                <Tooltip text="Retroceder (-10)" position="top">
                                    <button
                                        className="boton-cruceta"
                                        onClick={() => clickCruceta("arriba")}
                                    ></button>
                                </Tooltip>
                                <Tooltip text="Avanzar (+10)" position="bottom">
                                    <button
                                        className="boton-cruceta"
                                        onClick={() => clickCruceta("abajo")}
                                    ></button>
                                </Tooltip>
                            </div>
                            <Tooltip text="Siguiente (+1)" position="right">
                                <button
                                    className="boton-cruceta boton-cruceta-horizontal"
                                    onClick={() => clickCruceta("der")}
                                ></button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className="medio"></div>
                <div className="tapa-der">
                    <div className="borde-der"></div>
                    <div className="interior-tapa-der">
                        <div className="pantalla pantalla-mediana">
                            {pantallaModo === "descripcion" && (
                                <DescripcionPokemon descripcion={descripcionPoke} />
                            )}
                            {pantallaModo === "stats" && pkmnActual.stats && (
                                <div className="contenido-pantalla-stats">
                                    {pkmnActual.stats.map((stat, idx) => (
                                        <div key={idx} className="stat-row">
                                            <span className="stat-nombre">{stat.stat.name.toUpperCase()}</span>
                                            <div className="stat-barra">
                                                <div 
                                                    className="stat-valor" 
                                                    style={{width: `${(stat.base_stat / 255) * 100}%`}}
                                                ></div>
                                            </div>
                                            <span className="stat-numero">{stat.base_stat}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {pantallaModo === "info" && (
                                <div className="contenido-pantalla-info">
                                    <div className="info-row">
                                        <span className="info-label">ALTURA:</span>
                                        <span className="info-valor">{(pkmnActual.height / 10).toFixed(1)}m</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">PESO:</span>
                                        <span className="info-valor">{(pkmnActual.weight / 10).toFixed(1)}kg</span>
                                    </div>
                                    {pkmnActual.stats && (
                                        <div className="info-stats-completo">
                                            <div className="stat-item">
                                                <span className="stat-mini">HP</span>
                                                <span className="stat-mini-val">{pkmnActual.stats[0]?.base_stat}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-mini">ATK</span>
                                                <span className="stat-mini-val">{pkmnActual.stats[1]?.base_stat}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-mini">DEF</span>
                                                <span className="stat-mini-val">{pkmnActual.stats[2]?.base_stat}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-mini">SP.A</span>
                                                <span className="stat-mini-val">{pkmnActual.stats[3]?.base_stat}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-mini">SP.D</span>
                                                <span className="stat-mini-val">{pkmnActual.stats[4]?.base_stat}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-mini">SPD</span>
                                                <span className="stat-mini-val">{pkmnActual.stats[5]?.base_stat}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {pantallaModo === "evoluciones" && evolucionData && (
                                <div className="contenido-evoluciones">
                                    {evolucionData.flatMap((evo, idx) => {
                                        const spriteRetro = evo.id
                                            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/${evo.id}.png`
                                            : null;

                                        const item = (
                                            <div key={`evo-${idx}`} className="evo-item">
                                                {spriteRetro ? (
                                                    <img
                                                        src={spriteRetro}
                                                        alt={evo.name}
                                                        className="sprite-retro"
                                                        onError={(e) => {
                                                            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`;
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="sprite-placeholder">?</div>
                                                )}
                                                <span className="evo-nombre">{evo.name}</span>
                                            </div>
                                        );

                                        const flecha = idx < evolucionData.length - 1 ? (
                                            <svg key={`flecha-${idx}`} className="evo-flecha" viewBox="0 0 24 24">
                                                <path d="M5 12h14m-7-7l7 7-7 7" stroke="#28acff" strokeWidth="2" fill="none"/>
                                            </svg>
                                        ) : null;

                                        return [item, flecha];
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="grupo-botones-der">
                            <Tooltip text="Generación 1 - Kanto" position="right"><button className="boton-azul" onClick={() => clickGeneracion(0)}>1️⃣</button></Tooltip>
                            <Tooltip text="Generación 2 - Johto" position="right"><button className="boton-azul" onClick={() => clickGeneracion(1)}>2️⃣</button></Tooltip>
                            <Tooltip text="Generación 3 - Hoenn" position="right"><button className="boton-azul" onClick={() => clickGeneracion(2)}>3️⃣</button></Tooltip>
                            <Tooltip text="Generación 4 - Sinnoh" position="right"><button className="boton-azul" onClick={() => clickGeneracion(3)}>4️⃣</button></Tooltip>
                            <Tooltip text="Generación 5 - Unova" position="right"><button className="boton-azul" onClick={() => clickGeneracion(4)}>5️⃣</button></Tooltip>
                            <Tooltip text="Generación 6 - Kalos" position="right"><button className="boton-azul" onClick={() => clickGeneracion(5)}>6️⃣</button></Tooltip>
                            <Tooltip text="Generación 7 - Alola" position="right"><button className="boton-azul" onClick={() => clickGeneracion(6)}>7️⃣</button></Tooltip>
                            <Tooltip text="Generación 8 - Galar" position="right"><button className="boton-azul" onClick={() => clickGeneracion(7)}>8️⃣</button></Tooltip>
                            <Tooltip text="Generación 9 - Paldea" position="right"><button className="boton-azul" onClick={() => clickGeneracion(8)}>9️⃣</button></Tooltip>
                            <button className="boton-azul"></button>
                        </div>
                        <div className="grupo-botones-blanco">
                            <div className="botones-blancos-grupo">
                                <Tooltip text="Descripción" position="top"><button className="boton-blanco" onClick={mostrarDescripcion}>📖</button></Tooltip>
                                <Tooltip text="Evoluciones" position="top"><button className="boton-blanco" onClick={mostrarEvoluciones}>🧬</button></Tooltip>
                                <Tooltip text="Info" position="top"><button className="boton-blanco" onClick={mostrarInfo}>ℹ️</button></Tooltip>
                            </div>
                            <Tooltip text="Leer descripción" position="left">
                                <button
                                    className="boton-circulo circulo-amarillo"
                                    onClick={() => reproducirAudio(datosExtraPoke)}
                                >
                                    🔊
                                </button>
                            </Tooltip>
                        </div>
                        <div className="grupo-pantallas-chicas">
                            <TipoPokemon pokemon={pkmnActual} slot={1} />
                            <TipoPokemon pokemon={pkmnActual} slot={2} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pokedex;
