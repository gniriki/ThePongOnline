class GameMode {
    public maxPlayers: number;

    public static twoPlayerMode(): GameMode {
        let mode = new GameMode();
        mode.maxPlayers = 2;
        return mode;
    }
}