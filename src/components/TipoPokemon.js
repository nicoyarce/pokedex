const TipoPokemon = ({ pokemon, slot }) => {
    const { types } = pokemon;
    if (types) {
        const tipoPokemon = types?.filter((tipos) => tipos.slot === slot);
        const stringTipo = tipoPokemon[0]?.type?.name;
        if (stringTipo !== undefined) {
            const rutaImagen = `${process.env.PUBLIC_URL}/Iconos/Tipos/${stringTipo}.gif`;
            return (
                <div className="pantalla pantalla-chica">
                    <img src={rutaImagen} alt={stringTipo}></img>
                </div>
            );
        } else {
            return <div className="pantalla pantalla-chica"></div>;
        }
    } else {
        const rutaImagen = `${process.env.PUBLIC_URL}/Iconos/Tipos/unknown.gif`;
        return (
            <div className="pantalla pantalla-chica">
                <img src={rutaImagen} alt="unknown"></img>
            </div>
        );
    }
};

export default TipoPokemon;
