const MiniPantalla = ({ inputPokemon, onChange }) => {
    return (
        <div className="mini-pantalla">
            <input
                type="text"
                className="texto-mini-pantalla"
                value={inputPokemon}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Buscar Pokémon..."
            />
        </div>
    );
};

export default MiniPantalla;
