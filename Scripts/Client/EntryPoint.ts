import { GameClient } from "./GameClient";

(<any>window).connectToGame = () => {
    var gameClient = new GameClient();
    gameClient.run();
};