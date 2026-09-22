// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";

import fs from "fs";
// importar a classe Player .ts
import { Player } from "./models/Player.js";
import { takeCoverage } from "node:v8";



// Cria uma aplicação Express
// A função express() devolve um objeto que representa o servidor da aplicação
const app: Express = express();

// Middleware para permitir que o servidor entenda requisições com corpo em Json
app.use(express.json());

// Define a porta onde o servidor ficará disponível
// Neste caso, o servidor poderá ser acessado pela porta 8081
const PORT: number = 8081;

// Define o nome do diretorio onde os arquivos serão armazenados
const DATA_FILE = "./data/players.json";

/*
Função para garantir que o diretório dados exista antes de salvar os arquivos.

*/
function ensureDataFolderExists() {
  const dataFolder = "./data";
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
  }
}

//chamar a função para garantir que o diretório de dados exista
//antes de qualquer operação de leitura ou escrita de arquivos
ensureDataFolderExists();

//Função para salvar os dados do player em um arquivo JSON
function savePlayerState(player: Player) {
  // Converte o objeto player em uma string JSON
  const data = JSON.stringify(player, null, 2);
  // Salva a string JSON no arquivo defido em DATA_FILE
  fs.writeFileSync(DATA_FILE, data, "utf-8");
}

// Função para carregar os dados do player de um arquivo JSON
function loadPlayerState(): Player {
  // Verifica se o arquivo de dados existe
  if (fs.existsSync(DATA_FILE)) {
    // lê o conteúdo do arquivo e converte de volta para um objeto Player
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const playerData = JSON.parse(data);

    /* ATENÇÃO: JSON.parse() retorna um objeto "puro"
    (sem os metodos da classe player).
    Para que objeto tenha métodos de classe Player, precisamos criar
    uma nova instância da classe Player e passar os dados carregados
    para o construtor.
    */
    return new Player(playerData.name, playerData.health, playerData.level);
  }
  // Cria um novo player se não existir com o nome "Jogador1", 100 de vida e Nível 1
  const newPlayer = new Player("Filas", 100, 1);
  savePlayerState(newPlayer);
  return newPlayer;
}
// Inicializa o player carregando seu estado do arquivo JSON
let player: Player = loadPlayerState();


// Instaciação de um jogador utilizado a classe Player
// Criamos (instanciamos) um novo jogador chamado "Hero" com 100 de saúde e nível 1
// a partir da classe Player que foi importada do arquivo Player.ts
let player1: Player = new Player("Hero", 100, 5);

// Rota GET para obter informações do jogador 
// Quando o úsuario acesar a rota "/player", o servidor responderá com os dados do jogador
// É utilizada para enviar dados ou realizar ações que alteram o estado do servidor,
// como nesta caso, onde o jogador realiza uma ação (como acionar um comportamento de ataque),
// que é o método attack () do jogador,
// A função de callback recebe dois parâmetros: req (requisição) e res (resposta)

app.get("/player", (req: Request, res: Response) => {
  res.json({
    message: "informaçoes do Player",
    player: player1
  });
});

app.get("/player/attack", (req: Request, res: Response) => {
  const attackMessage = player1.attack();

  res.json({
    message: attackMessage,
  });
});

app.post("/player/take-damage", (req: Request, res: Response) => {
  // Extrai o valor do dano da requisição
  const { damage } = req.body;
  // Chama o método takeDamege() do jogador
  const damageMessage = player1.takeDamage(damage);
  // Salvar o estado atual do player no arquivo JSON
  savePlayerState(player);
  // Retorna uma resposta Json com a mensagem do dano
  // para o cliente que fez a requisição 
  res.json({
    // Retorna a mensagem do dano recibido
    acction: damageMessage,
    // Retorna a saúde atual do jogador
    currentHealth: player1.health,
    // Retorna o nível atual do jogador
    currentLevel: player1.level
  });
});


app.post("/player/health", (req: Request, res: Response) => {
  // Extrai o valor do dano da requisição
  const { health } = req.body;
  // Chama o método takeDamege() do jogador
  const healthMessage = player1.takeHealth(health);
  // Salvar o estado atual do player no arquivo JSON
  savePlayerState(player);
  // Retorna uma resposta Json com a mensagem do dano
  // para o cliente que fez a requisição 
  res.json({
    // Retorna a mensagem do dano recibido
    acction: healthMessage,
    // Retorna a saúde atual do jogador
    currentHealth: player1.health,
    // Retorna o nível atual do jogador
    currentLevel: player1.level
  });
});
app.post("/player/level", (req: Request, res: Response) => {
  // Extrai o valor do dano da requisição
  const { level } = req.body;
  // Chama o método takeDamege() do jogador
  const levelMessage = player1.takeLevel(level);
  // Salvar o estado atual do player no arquivo JSON
  savePlayerState(player);
  // Retorna uma resposta Json com a mensagem do dano
  // para o cliente que fez a requisição 
  res.json({
    // Retorna a mensagem do dano recibido
    acction: levelMessage,
    // Retorna a saúde atual do jogador
    currentLevel: player1.level,
  });
});

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Rotas disponíveis:");
  console.log(`GET http://localhost:${PORT}/player - Obter informações do jogador`);
  console.log(`GET http://localhost:${PORT}/player/attack - jogador realiza um ataque`);
  console.log(`POST http://localhost:${PORT}/player/take-damage - jogador recebe dano`);
  console.log(`POST http://localhost:${PORT}/player/health - jogador ganhar vida`);
  console.log(`POST http://localhost:${PORT}/player/level - jogador ganhar level`);
});
