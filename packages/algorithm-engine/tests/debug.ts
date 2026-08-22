it("prints tokens", () => {
    const tokens = tokenize("Definir edad Como Entero");

    console.table(
        tokens.map(token => ({
            type: token.type,
            lexeme: token.lexeme,
            value: token.value
        }))
    );
});