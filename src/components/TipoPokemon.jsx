import { memo } from "react";

const TipoPokemon = memo(({ pokemon, slot }) => {
    const types = pokemon?.types;

    if (!types) {
        const rutaImagen = `${import.meta.env.BASE_URL}Iconos/Tipos/unknown.gif`;
        return (
            <div className="pantalla pantalla-chica">
                <img src={rutaImagen} alt="unknown" />
            </div>
        );
    }

    const tipoPokemon = types.find((tipos) => tipos.slot === slot);

    if (!tipoPokemon?.type?.name) {
        return <div className="pantalla pantalla-chica"></div>;
    }

    const stringTipo = tipoPokemon.type.name;
    const rutaImagen = `${import.meta.env.BASE_URL}Iconos/Tipos/${stringTipo}.gif`;

    return (
        <div className="pantalla pantalla-chica">
            <img src={rutaImagen} alt={stringTipo} />
        </div>
    );
});

TipoPokemon.displayName = "TipoPokemon";

export default TipoPokemon;
