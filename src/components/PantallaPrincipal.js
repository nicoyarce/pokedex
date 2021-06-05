const PantallaPrincipal = ({ pokemon }) => {
    const { name, sprites } = pokemon;

    return (
        <div className="pantalla pantalla-grande">
            <img
                src={
                    sprites || pokemon == null
                        ? sprites.other["official-artwork"].front_default
                        : `${process.env.PUBLIC_URL}/Iconos/signo_pregunta.png`
                }
                alt={name}
            ></img>
        </div>
    );
};

export default PantallaPrincipal;
