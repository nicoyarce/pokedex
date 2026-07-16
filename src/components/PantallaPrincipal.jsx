import { memo } from "react";

const PantallaPrincipal = memo(({ pokemon, shiny }) => {
    const url = pokemon?.sprites?.other?.["official-artwork"]?.front_shiny
        ? shiny
            ? pokemon.sprites.other["official-artwork"].front_shiny
            : pokemon.sprites.other["official-artwork"].front_default
        : shiny
            ? pokemon?.sprites?.front_shiny
            : pokemon?.sprites?.front_default;

    const fallbackUrl = `${import.meta.env.BASE_URL}Iconos/signo_pregunta.png`;
    const imageUrl = url || fallbackUrl;

    return (
        <div className="pantalla pantalla-grande">
            <img
                src={imageUrl}
                alt={pokemon?.name || "Pokémon"}
                loading="lazy"
            />
        </div>
    );
});

PantallaPrincipal.displayName = "PantallaPrincipal";

export default PantallaPrincipal;
