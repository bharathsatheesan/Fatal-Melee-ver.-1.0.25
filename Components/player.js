class Player {
  constructor(){
    this.index = null;
    this.character = 1;
    this.name = null;
    this.rank = null;
    this.totalPlayers = 0;
    this.x = 0;
    this.y = windowHeight/2;
    this.isHitting = 0;
    this.health = 500;
    this.kills = 0;
    this.damage = 0;
  }

  getCount(){
    var playerCountRef = database.ref('playerCount');
    playerCountRef.on("value",(data)=>{
      playerCount = data.val();
    })
  }

  updateCount(count){
    database.ref("/").update({
      playerCount:count
    })
  }

  update(){
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).set({
      name:this.name,
      character:home.name[this.character-1],
      x:this.x,
      y:this.y,
      isHitting:this.isHitting,
      health:this.health,
      kills:this.kills,
      damage:this.damage
    });
  }

  static getPlayerInfo(){
    var playerInfoRef = database.ref('players');
    playerInfoRef.on("value",(data)=>{
      allPlayers = data.val();
    })
  }
}
