import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./ModalBienvenida.css";

// Botón de ayuda con tooltip propio. Se renderiza fuera del árbol de la pokedex
// (portal a document.body) y mide el botón fixed directamente, no un wrapper.
const BotonAyuda = ({ onClick }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    const show = () => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ top: r.top + r.height / 2, left: r.left - 8 });
        setVisible(true);
    };

    return createPortal(
        <>
            <button
                ref={ref}
                className="boton-ayuda"
                aria-label="Ver guía"
                onClick={onClick}
                onMouseEnter={show}
                onMouseLeave={() => setVisible(false)}
            >❓</button>
            <span
                className={`tooltip-bubble tooltip-left ${visible ? "tooltip-visible" : ""}`}
                style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
            >Ver guía</span>
        </>,
        document.body
    );
};

export default BotonAyuda;
