// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";
// importar a classe Player .ts
import { Player }  from "./models/Player.js";
import { takeCoverage } from "node:v8";



// Cria uma aplicação Express
// A função express() devolve um objeto que representa o servidor da aplicação
const app: Express = express();

// Middleware para permitir que o servidor entenda requisições com corpo em Json
app.use(express.json());

// Define a porta onde o servidor ficará disponível
// Neste caso, o servidor poderá ser acessado pela porta 8081
const PORT: number = 8081;

// Instaciação de um jogador utilizado a classe Player
// Criamos (instanciamos) um novo jogador chamado "Hero" com 100 de saúde e nível 1
// a partir da classe Player que foi importada do arquivo Player.ts
let Player1: Player = new Player("Hero", 100, 5);

// Rota GET para obter informações do jogador 
// Quando o úsuario acesar a rota "/player", o servidor responderá com os dados do jogador
// É utilizada para enviar dados ou realizar ações que alteram o estado do servidor,
// como nesta caso, onde o jogador realiza uma ação (como acionar um comportamento de ataque),
// que é o método attack () do jogador,
// A função de callback recebe dois parâmetros: req (requisição) e res (resposta)

app.get("/player", (req: Request, res: Response) => {
  res.json({
    message: "informaçoes do Player",
    player: Player1
  });
});

app.get("/player/attack", (req: Request, res: Response) => {
  const attackMessage = Player1.attack();

  res.json({
    message: attackMessage,
  });
});




app.post("/player/damage", (req: Request, res: Response) => {
    const { damage } = req.body; // Obtém a quantidade de dano do corpo da requisição
    const damageMessage = Player1.takeDamage(damage);
    res.json({
        message: damageMessage
    });
});







// Rota Post para o jogador receber o dano 
// Quando o úsuario aecssar a rota ""


app.post("/player/take-damege", (req: Request, res: Response) => {
  // Extrai o valor do dano da requisição
  const { damage } = req.body;
  // Chama o método takeDamege() do jogador
   const damageMessage = Player1.takeDamege(damage);
  // Retorna uma resposta Json com a mensagem do dano
  // para o cliente que fez a requisição 
  res.json({
    // Retorna a mensagem do dano recibido
    acction: damageMessage,
    // Retorna a saúde atual do jogador
    currentHealth: Player1.health,
    // Retorna o nível atual do jogador
    currentLevel: Player1.level
  });
});

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Rotas disponíveis:");
  console.log(`GET http://localhost:${PORT} /player - Obter informações do jogador`);
  console.log(`GET http://localhost:${PORT} /player - jogador realiza um ataque`);
  console.log(`POST http://localhost:${PORT} /player/take-damege - jogador recebe dano`);
});
