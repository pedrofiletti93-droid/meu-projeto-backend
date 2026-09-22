// A palavra "Class" define que estamos criando um molde.
// A palavra "export" permite que esse arquivo seja usado.

import { publicDecrypt } from "node:crypto";

// por outros arquivos (como o app .ts).
export class Player {
    public name: string; // nome jogador (texto)
    public health: number; // a saúde do jogador (número)
    public level: number; // o nível d jogador (número)

    // construtores (O construtor é um metodo especial que executado
    // automaticamente quando a classe é instanciada uma unica vez)
    constructor(name: string, health: number = 100, level: number = 1) {
        // A palvra "this" faz referência a própria classe, ou seja:
        // "Pegue" o atributo `name` da classe Player e atríbua

        this.name = name;
        this.health = health;
        this.level = level;
    }

    public attack(): string {
        const damege = this.level * 10;
        return `${this.name} atacou e causou $ {demage} de dano!`
    }


    public takeDamage(amount: number): string {
        this.health -= amount;
        if (this, this.health < 0) {
            this.health = 0;
            return `${this.name} foi derrotado!` ;
        }

        return `${this.name} recebeu ${amount} de dano e agora tem ${this.health} de saúde.` ;

        
    }

    public takeHealth(health: number): string {
        this.health += health;
        if (this, this.health >= 100) {
            this.health = 100;
        }
        return `${this.name} recebeu ${health} e agora tem ${this.health} de saúde.` ;
    }

    public takeLevel(level: number): string {
        this.level += level;
        if (this, this.level >= 5) {
            this.level = 50;
        }
        return `${this.name} recebeu ${this.level} e agora tem ${this.level} de saúde.` ;
    }
}   


