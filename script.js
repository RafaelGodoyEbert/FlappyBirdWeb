let frames = 0;
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
        return true;
    }
    return false;
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
            if(fazColisao(flappyBird, globais.chao)){
                console.log('fez colisão');
                SFX_hit.play();

                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 600);
                
                return;            
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
        ],
        frameAtual: 0,
        atualizarOFrameAtual(){
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;
      // console.log('passouOIntervalo', passouOIntervalo)

      if(passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao
      }
        },
        desenhar() {
            flappyBird.atualizarOFrameAtual();
            const { spriteX, spriteY } = this.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites,
                spriteX, spriteY, 
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
function criaChao() {
    const chao = {
        spriteX: 0, //Sprite X, Sprite Y
        spriteY: 610,
        largura: 224, //Tamanho do recorte na sprite
        altura: 112,
        x: 0, //Local onde vai ficar no meu canvas
        y: canvas.height - 112, 
        atualiza(){
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            const movimentacao = chao.x - movimentoDoChao;

            // console.log('[chao.x]', chao.x);
            // console.log('[repeteEm]',repeteEm);
            // console.log('[movimentacao]', movimentacao % repeteEm);

            chao.x = movimentacao % repeteEm;
        },
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
        },
    };
    return chao;
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

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,

        desenhar() {
        canos.pares.forEach(function(par){
                const yRandom = par.y;
                const espacamentoEntreCanos = 290;
    
                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                //Cano Céu
                contexto.drawImage(
                    sprites, 
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                )
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                 //Cano Chão
                 contexto.drawImage(
                    sprites, 
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    y: canoChaoX,
                    y: canoChaoY
                }
            })
        },
        temColisaoComOFlappyBird(par){
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
                if(cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }
                if(peDoFlappy >= par.canoChao.y){
                    return true;
                }
            }
            return false;
        },
        pares: [],
        atualiza(){
            const passou100Frames = frames % 100 === 0;
            if(passou100Frames){
                canos.pares.push({
                        x: canvas.width,
                        y: -150 * (Math.random() + 1),
                    });
            }
        
        canos.pares.forEach(function(par){
            par.x = par.x - 2;
            if(canos.temColisaoComOFlappyBird(par)){
                // console.log('voce perdeu');
                mudaParaTela(Telas.INICIO);
                SFX_hit.play();
                // mudaParaTela(tela.GAME_OVER);
            }
            if(par.x + canos.largura <= 0){
                canos.pares.shift();
            }
        });
      }    
    }
    return canos;
}
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
            globais.canos = criaCanos();
            globais.chao = criaChao();
            
        },
        desenha(){            
            planoDeFundo.desenhar();
            globais.chao.desenhar();
            globais.flappyBird.desenhar();
            // console.log(globais.canos)
            
            mensagemGetReady.desenha();
        },
        click(){
            mudaParaTela(Telas.JOGO);
        },
        atualiza(){
            globais.chao.atualiza();            
        }
    }
};
Telas.JOGO = {
    desenha() {      
        planoDeFundo.desenhar();
        globais.canos.desenhar();
        globais.chao.desenhar();
        globais.flappyBird.desenhar();        
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.flappyBird.atualiza();
    }
};


function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames = frames + 1;
    requestAnimationFrame(loop);
};

window.addEventListener('click', function(){
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(Telas.INICIO);

loop();