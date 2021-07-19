class Game{
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      home = new Home();
      home.display();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
    }

    //to create sprites for each player
    player1 = createSprite(100, 100);
    player1.addImage("Not", NonHittingPlayerImage);
    player1.addImage("Is", HittingPlayerImage);
    player1.scale = 0.17;
    player1.depth = -10;
    player2 = createSprite(displayWidth-100, 100);
    player2.addImage("Not", NonHittingPlayerImage);
    player2.addImage("Is", HittingPlayerImage);
    player2.scale = 0.17;
    player2.depth = -10;
    player3 = createSprite(100, displayHeight-100);
    player3.addImage("Not", NonHittingPlayerImage);
    player3.addImage("Is", HittingPlayerImage);
    player3.scale = 0.17;
    player3.depth = -10;
    player4 = createSprite(displayWidth-100, displayHeight-100);
    player4.addImage("Not", NonHittingPlayerImage);
    player4.addImage("Is", HittingPlayerImage);
    player4.scale = 0.17;
    player4.depth = -10;

    players.push(player1, player2, player3, player4);
  }

  play(){
    Player.getPlayerInfo();
    home.hideForGame();
    
    if(allPlayers !== undefined){
      background("#C68767");
      image(battlegroundImage, 0, 0, windowWidth, windowHeight);

      var index = 0;

      for(var plr in allPlayers){
        //index incremented by one
        index = index + 1;

        //assigning x and y to the x and y of each player
        var x = allPlayers[plr].x
        var y = allPlayers[plr].y
        
        //setting the values of the sprites to the x and y, i.e, the x and y in the database(allPlayers[plr]).
        players[index-1].x = x
        players[index-1].y = y

        //code for the current player
        if (index === player.index){
          push();
          //for displaying the current player's statistics.
          textSize(25);
          textAlign(CENTER);
          strokeWeight(2);
          stroke("black");
          fill("white");
          text("You", players[index-1].x, players[index-1].y-40);
          text("HP:"+ player.health, camera.position.x+displayWidth/2, camera.position.y-displayHeight/2);
          text("Damage:"+player.damage, camera.position.x+displayWidth/2, camera.position.y-displayHeight/2+30);
          text("Kills:"+player.kills, camera.position.x+displayWidth/2, camera.position.y-displayHeight/2+60);
          pop();
          //centering the camera focus on the current player's sprite.
          camera.position.x = players[index-1].x;
          camera.position.y = players[index-1].y;
          /*decreasing health for the opponent, increasing damage points
          for the current player and changing the images of the current
          player if the current player is trying to hit the opponent
          (Refer player.js>>line no.36 and game.js>>line no.288).*/
          if(player.isHitting === 1){
            players[index-1].changeImage("Is");
            if(player.index === 1){
              this.onImpactTo(players[index-1], player2, "player2", player3, "player3", player4, "player4");
            } else if(player.index === 2){
              this.onImpactTo(players[index-1], player3, "player3", player1, "player1", player4, "player4");
            } else if(player.index === 3){
              this.onImpactTo(players[index-1], player2, "player2", player1, "player1", player4, "player4");
            } else if(player.index === 4){
              this.onImpactTo(players[index-1], player2, "player2", player3, "player3", player1, "player1");
            }
          } else if(player.isHitting === 0){
            players[index-1].changeImage("Not");
          }

          /*assigning hitRef1, hitRef2 etc. 
          to the values of the health of 
          player1, player2 etc. respectively,
          and then updating the value of
          health in each player's database to
          hitref, i.e, health minus dhRef.
          (Refer game.js>>line no. 288)*/
          database.ref("players/player1/health").on("value", (data)=>{
            hitRef1 = data.val();
            console.log(hitRef1);
          })
          if(IH === "player1"){
            database.ref("players/player1").update({
              health:hitRef1-dhRef
            });
            console.log(hitRef1);
            IH = "";
            player.update();
          }
          database.ref("players/player2/health").on("value", (data)=>{
            hitRef2 = data.val();
            console.log(hitRef2);
          })
          if(IH === "player2"){
            database.ref("players/player2").update({
              health:hitRef2-dhRef
            });
            IH = "";
            player.update();
          }
          database.ref("players/player3/health").on("value", (data)=>{
            hitRef3 = data.val();
          })
          if(IH === "player3"){
            database.ref("players/player3").update({
              health:hitRef3-dhRef
            });
            IH = "";
            player.update();
          }
          database.ref("players/player4/health").on("value", (data)=>{
            hitRef4 = data.val();
          })
          if(IH === "player4"){
            database.ref("players/player4").update({
              health:hitRef4-dhRef
            });
            IH = "";
            player.update();
          }

          console.log(hitRef1);

          /*to help in displaying the updated score of the current player,
          we assign hitRef to player's health property as the text is displayed
          on the information from it.*/
          if(player.index === 0 && player.health !== undefined){
            
          }
          else if(player.index === 1 && player.health !== undefined){
            player.health = hitRef1
          }else if(player.index === 2 && player.health !== undefined){
            player.health = hitRef2
          }else if(player.index === 3 && player.health !== undefined){
            player.health = hitRef3
          }else if(player.index === 4 && player.health !== undefined){
            player.health = hitRef4
          }

          /*for throwing an error in order to stop the programme from
          running and give the 'Game Over' message when their HP is 0.*/
          var healthRef
          database.ref("players/player"+player.index+"/health").on("value", (data)=>{
            healthRef = data.val();
          });
          if(healthRef <= 0){
            players[index-1].destroy();
            database.ref("players/player"+player.index).remove();
            playerCount -= 1;
            player.update();
            throw new Error("Game Over!");
          }

          //for giving the "You win" message when the player has won.
          if(hitRef1 < 0 && hitRef2 < 0 && hitRef3 < 0 && player.index === 4){
            var youWinMessage4 = createElement('h1', 'You Win');
            console.log(hitRef1);
            youWinMessage4.position(displayWidth/2+200, displayHeight/2-200);
            this.endEverything(false);
          } else if(hitRef1 < 0 && hitRef2 < 0 && hitRef4 < 0 && player.index === 3){
            var youWinMessage3 = createElement('h1', 'You Win');
            console.log(hitRef1);
            youWinMessage3.position(displayWidth/2, displayHeight/2);
            this.endEverything(false);
          } else if(hitRef1 < 0 && hitRef3 < 0 && hitRef4 < 0 && player.index === 2){
            var youWinMessage2 = createElement('h1', 'You Win');
            console.log(hitRef1);
            youWinMessage2.position(displayWidth/2, displayHeight/2);
            this.endEverything(false);
          } else if(hitRef2 < 0 && hitRef3 < 0 && hitRef4 < 0 && player.index === 1){
            var youWinMessage1 = createElement('h1', 'You Win');
            youWinMessage1.position(displayWidth/2, displayHeight/2);
            this.endEverything(false);
          }
        }

        //code for the other players.
        else{
          push();
          //for displaying their names.
          textSize(25);
          strokeWeight(2);
          stroke("black");
          fill("white");
          textAlign(CENTER);
          text(allPlayers[plr].name, players[index-1].x, players[index-1].y-40);
          pop();

          //for deleting the sprites from a player's canvas if a player's health is 0.
          if(hitRef1 < 0){
            player1.destroy();
            console.log(hitRef1);
          } else if(hitRef2 < 0){
            player2.destroy();
          } else if(hitRef3 < 0){
            player3.destroy();
          } else if(hitRef4 < 0){
            player4.destroy();
          }
        }
      }

      //code for the controls begins here...(Refer line no. 295)
      if(keyWentDown("space")){
        player.isHitting = 1;
      } else{
        player.isHitting = 0;
      }
      player.update();

      if(keyDown(UP_ARROW) && player.index !== null){
        player.y -= 10;
        player.update();
      }

      if(keyDown(DOWN_ARROW) && player.index !== null){
        player.y += 10;
        player.update();
      }

      if(keyDown(UP_ARROW) && player.index !== null && player.character === "Akio"){
        player.y -= 11;
        player.update();
      }

      if(keyDown(DOWN_ARROW) && player.index !== null && player.character === "Akio"){
        player.y += 11;
        player.update();
      }

      if(keyDown(RIGHT_ARROW) && player.index !== null){
        player.x += 10;
        player.update();
      }

      if(keyDown(LEFT_ARROW) && player.index !== null){
        player.x -= 10;
        player.update();
      }

      if(keyDown(RIGHT_ARROW) && player.index !== null && player.character === "Akio"){
        player.x += 11;
        player.update();
      }

      if(keyDown(LEFT_ARROW) && player.index !== null && player.character === "Akio"){
        player.x -= 11;
        player.update();
      }
    }
    //...and ends here(Refer line no.247)

    //for displaying the sprites.
    drawSprites();
  }

  //for ending the whole game for everone if the player presses the 'End game for everyone' button(Refer home.js>>line.no 18).
  async endEverything(reload){
    await database.ref("players").remove();
    await player.updateCount(0);
    this.update(0);
    if(reload === true){
      window.location.reload(true);
    }
  }

  //function for decreasing the health of the player who got hit and increasing the damage points for the player who hit.
  onImpactTo(Ofplayer, one, o, two, t, three, t2){
    if(Ofplayer.isTouching(one)){
      dhRef = Math.round(Math.abs((Ofplayer.x-one.x)-(Ofplayer.y-one.y)));
      player.damage += dhRef;
      IH = "" + o;
      player.update();
    } else if(Ofplayer.isTouching(two)){
      dhRef = Math.round(Math.abs((Ofplayer.x-two.x)-(Ofplayer.y-two.y)));
      player.damage += dhRef;
      IH = "" + t;
      player.update();
    } else if(Ofplayer.isTouching(three)){
      dhRef = Math.round(Math.abs((Ofplayer.x-three.x)-(Ofplayer.y-three.y)));
      player.damage += dhRef;
      IH = "" + t2;
      player.update();
    }
  }
}
