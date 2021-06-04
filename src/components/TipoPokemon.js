const TipoPokemon = ({ pokemon, slot }) => {
    const { types } = pokemon;
    if (types) {
        const tipoPokemon = types?.filter((tipos) => tipos.slot === slot);
        const stringTipo = tipoPokemon[0]?.type?.name;
        if (stringTipo !== undefined) {
            const rutaImagen = `../Iconos/Tipos/${stringTipo}.gif`;
            return (
                <div className="pantalla pantalla-chica">
                    <img src={rutaImagen} alt={stringTipo}></img>
                </div>
            );
        } else {
            return <div className="pantalla pantalla-chica"></div>;
        }
    } else
        return (
            <div className="pantalla pantalla-chica">
                <img src="../Iconos/Tipos/unknown.gif" alt="unknown"></img>
            </div>
        );
};

export default TipoPokemon;
