import { PongHttpServer } from "./Scripts/HttpServer/PongHttpServer";
import { GameServer } from "./Scripts/PongServer/GameServer";

let httpServer = new PongHttpServer();

httpServer.run();

let gameServer = new GameServer();

gameServer.run();

