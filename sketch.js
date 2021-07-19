var gameState = 0;
var roomCount;
var distance = 0;
var database;
var playerCount = 0;
var allPlayers;
var health;
var dhRef;
var IH = "";
var hitRef1, hitRef2, hitRef3, hitRef4

var player1, player2, player3, player4
var players = [];

var home, game, player;
var battlegroundImage, HittingPlayerImage, NonHittingPlayerImage;

function preload(){
    battlegroundImage = loadImage("Images/BattleGround.png");
    NonHittingPlayerImage = loadImage("Images/NonHittingSprite.png");
    HittingPlayerImage = loadImage("Images/HittingSprite.png");
}

function setup(){
    createCanvas(windowWidth, windowHeight);

    database = firebase.database();

    game = new Game();
    game.start();
    game.getState();
}

function draw(){
    background("brown");

    if(gameState === 0){
        if(keyWentDown(LEFT_ARROW) && player.character > 1 && home.lock === false){
            player.character -= 1
        }
    
        if(keyWentDown(RIGHT_ARROW) && player.character < 2 && home.lock === false){
            player.character += 1
        }
    
        home.character.html(home.name[player.character-1]);
        home.characterInfo.html(home.nameInfo[player.character-1]);
    }

    if(playerCount === 4){
        game.update(1);
    }
    
    if(gameState === 1){
        clear();
        game.play();
    }

    if(gameState === 2){
        game.end();
    }
}

