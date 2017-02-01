import { PongHttpServer } from "./HttpServer/PongHttpServer";
import { GameServer } from "./PongServer/GameServer";

let httpServer = new PongHttpServer();

httpServer.run();

let gameServer = new GameServer();

gameServer.run();

