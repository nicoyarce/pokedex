import { useState } from "react";
import "./ModalBienvenida.css";

const ModalBienvenida = ({ onClose }) => {
    const [activeIdx, setActiveIdx] = useState(0);

    const caracteristicas = [
        {
            emoji: "🔎",
            titulo: "Buscar Pokémon",
            desc: "Escribe el nombre o número en la pantalla pequeña y pulsa el botón verde."
        },
        {
            emoji: "🧭",
            titulo: "Cruceta de navegación",
            desc: "Usa las flechas para moverte: izquierda/derecha (±1) y arriba/abajo (±10)."
        },
        {
            emoji: "✨",
            titulo: "Efecto Shiny",
            desc: "Pulsa el botón rojo sobre la pantalla principal para ver la versión shiny del Pokémon."
        },
        {
            emoji: "🔢",
            titulo: "Botones de generación",
            desc: "Los botones azules numerados te llevan al primer Pokémon de cada generación (Kanto, Johto, ...)."
        },
        {
            emoji: "📖",
            titulo: "Pantallas de información",
            desc: "📖 Descripción · 🧬 Evoluciones · ℹ️ Info (altura, peso, stats)."
        },
        {
            emoji: "🔊",
            titulo: "Audio",
            desc: "Pulsa el botón amarillo para escuchar la descripción en español."
        }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-bienvenida" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

                <div className="modal-header">
                    <div className="modal-luces">
                        <span className="luz-modal luz-roja"></span>
                        <span className="luz-modal luz-amarilla"></span>
                        <span className="luz-modal luz-verde"></span>
                    </div>
                    <h2 className="modal-titulo">¿Qué puedo hacer?</h2>
                    <p className="modal-subtitulo">Guía rápida de la Pokédex</p>
                </div>

                <div className="modal-contenido">
                    <div className="modal-lista">
                        {caracteristicas.map((item, idx) => (
                            <button
                                key={idx}
                                className={`modal-item ${activeIdx === idx ? "modal-item-activo" : ""}`}
                                onClick={() => setActiveIdx(idx)}
                            >
                                <span className="modal-item-emoji">{item.emoji}</span>
                                <span className="modal-item-titulo">{item.titulo}</span>
                            </button>
                        ))}
                    </div>

                    <div className="modal-detalle">
                        <div className="modal-detalle-emoji">
                            {caracteristicas[activeIdx].emoji}
                        </div>
                        <h3>{caracteristicas[activeIdx].titulo}</h3>
                        <p>{caracteristicas[activeIdx].desc}</p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="modal-boton-entendido" onClick={onClose}>
                        ¡Entendido! Empezar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalBienvenida;
