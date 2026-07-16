import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Tooltip.css";

const Tooltip = ({ text, children, position = "top" }) => {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const wrapperRef = useRef(null);

    const updateCoords = () => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        let top = 0;
        let left = 0;

        switch (position) {
            case "top":
                top = rect.top - 8;
                left = rect.left + rect.width / 2;
                break;
            case "bottom":
                top = rect.bottom + 8;
                left = rect.left + rect.width / 2;
                break;
            case "left":
                top = rect.top + rect.height / 2;
                left = rect.left - 8;
                break;
            case "right":
                top = rect.top + rect.height / 2;
                left = rect.right + 8;
                break;
            default:
                top = rect.top - 8;
                left = rect.left + rect.width / 2;
        }

        setCoords({ top, left });
    };

    const handleMouseEnter = () => {
        updateCoords();
        setVisible(true);
    };

    const handleMouseLeave = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (!visible) return;
        const onScroll = () => setVisible(false);
        const onResize = () => setVisible(false);
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
        };
    }, [visible]);

    const tooltipNode = (
        <span
            className={`tooltip-bubble tooltip-${position} ${visible ? "tooltip-visible" : ""}`}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
        >
            {text}
        </span>
    );

    return (
        <span
            className="tooltip-wrapper"
            ref={wrapperRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {createPortal(tooltipNode, document.body)}
        </span>
    );
};

export default Tooltip;
