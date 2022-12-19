const  SFX_hit = new Audio();
SFX_hit.src = './SFX/hit.wav';

const sprites = new Image();
sprites.src= './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext("2d");

function fazColisao(flappyBird, chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;
    
    if(flappyBirdY >= chaoY){
        return true
    }
    return false
}
//Passáro
function criarFlappyBird(){
    const flappyBird = {
        spriteX: 0, //Sprite X, Sprite Y
        spriteY: 0,
        largura: 34, //Tamanho do recorte na sprite
        altura: 24,
        x: 10, //Local onde vai ficar no meu canvas
        y: 50,
        pulo: 4.6,
        pula() {
            console.log('pulei');
            flappyBird.velocidade = - flappyBird.pulo;
            console.log('[antes]', flappyBird.velocidade);
            console.log('[Depois]', flappyBird.velocidade);
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza(){
            if(fazColisao(flappyBird, chao)){
                console.log('fez conlisão');
                SFX_hit.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 600);
                
                return;            
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        desenhar() {
            contexto.drawImage(
                sprites,
                flappyBird.spriteX, flappyBird.spriteY, 
                flappyBird.largura, flappyBird.altura, 
                flappyBird.x, flappyBird.y, 
                flappyBird.largura, flappyBird.altura,
                );    
        }
    };
    return flappyBird;
}


//Plano de fundo
const planoDeFundo = {
    spriteX: 390, //Sprite X, Sprite Y
    spriteY: 0,
    largura: 276, //Tamanho do recorte na sprite
    altura: 204,
    x: 0, //Local onde vai ficar no meu canvas
    y: canvas.height - 204,
    desenhar() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY, 
            planoDeFundo.largura, planoDeFundo.altura, 
            planoDeFundo.x, planoDeFundo.y, 
            planoDeFundo.largura, planoDeFundo.altura,
            );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY, 
            planoDeFundo.largura, planoDeFundo.altura, 
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
            );    
    }
};

//Chão
const chao = {
    spriteX: 0, //Sprite X, Sprite Y
    spriteY: 610,
    largura: 224, //Tamanho do recorte na sprite
    altura: 112,
    x: 0, //Local onde vai ficar no meu canvas
    y: canvas.height - 112,
    desenhar() {
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY, 
            chao.largura, chao.altura, 
            chao.x, chao.y, 
            chao.largura, chao.altura,
            );
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY, 
            chao.largura, chao.altura, 
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,
            );    
    }
};

//Menu
const mensagemGetReady = {
    spriteX: 134, //Sprite X, Sprite Y
    spriteY: 0,
    largura: 174, //Tamanho do recorte na sprite
    altura: 152,
    x: (canvas.width/2) - 172 / 2, //Local onde vai ficar no meu canvas
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.spriteX, mensagemGetReady.spriteY, 
            mensagemGetReady.largura, mensagemGetReady.altura, 
            mensagemGetReady.x, mensagemGetReady.y, 
            mensagemGetReady.largura, mensagemGetReady.altura,
        );    
    }
};
//
// Telas
//
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
    if(telaAtiva.inicializa){
        telaAtiva.inicializa();
    }
};

const Telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criarFlappyBird();
        },
        desenha(){            
            planoDeFundo.desenhar();
            chao.desenhar();
            globais.flappyBird.desenhar();
            mensagemGetReady.desenha();
        },
        click(){
            mudaParaTela(Telas.JOGO);
        },
        atualiza(){
        }
    }
};
Telas.JOGO = {
    desenha() {       
        planoDeFundo.desenhar();
        chao.desenhar();
        globais.flappyBird.desenhar();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();
    }
};


function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    requestAnimationFrame(loop);
};

window.addEventListener('click', function(){
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);

loop();

//aaaaaaaaaaaaaaaaaaaaaaaaaaaa