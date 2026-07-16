import { memo } from "react";

const DescripcionPokemon = memo(({ descripcion }) => (
    <p className="texto-pantalla-mediana">
        {descripcion?.split("\n").map((line, i) => (
            <span key={i}>
                {line}
                {i < descripcion.split("\n").length - 1 && <br />}
            </span>
        ))}
    </p>
));

DescripcionPokemon.displayName = "DescripcionPokemon";

export default DescripcionPokemon;
