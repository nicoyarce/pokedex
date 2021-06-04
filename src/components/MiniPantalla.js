const MiniPantalla = ({ inputPokemon, setInputPokemon }) => {
    const handleOnChange = (texto) => {
        setInputPokemon(texto);
    };

    return (
        <div className="mini-pantalla">
            <input
                type="text"
                className="texto-mini-pantalla"
                value={inputPokemon}
                onChange={(e) => handleOnChange(e.target.value)}
            />
        </div>
    );
};

export default MiniPantalla;
