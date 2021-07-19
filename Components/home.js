class Home{
    constructor(){
        this.playButton = createButton("Play");
        this.characterButton = createButton("Character Select");
        this.gameTitle = createElement("h1", "Fatal Melee");
        this.nameInput = createInput("").attribute("placeholder", "Your name goes here...");
        this.selectCharacterButton = createButton("Select");
        this.characterScrollInstr = createElement("h1", "Use Left and Right Arrow");

        this.name = ["John", "Akio"];
        this.nameInfo = ["Ability: 20% increase in damage", "Ability: Movement Speed Increase by 10%"]
        this.character = createElement("h1");
        this.characterInfo = createElement("h2");

        this.greeting = createElement("h1");
        this.message = createElement("h2", "Waiting for players...");

        this.resetButton = createButton("End game for everyone");

        this.lock = true;
    }

    hideForGame(){
        this.greeting.hide();
        this.message.hide();
    }

    hideHomeComp(){
        this.playButton.hide();
        this.characterButton.hide();
        this.gameTitle.hide();
        this.nameInput.hide();
    }

    showHomeComp(){
        this.playButton.show();
        this.playButton.position(windowWidth/2, windowHeight/3);
        this.characterButton.show();
        this.characterButton.position(windowWidth/2-30, windowHeight/3+30);
        this.gameTitle.show();
        this.gameTitle.position(windowWidth/2-50, 50);
        this.nameInput.show();
        this.nameInput.position(windowWidth/2-60, windowHeight/3-30);
    }

    hideForHome(){
        this.selectCharacterButton.hide();
        this.characterScrollInstr.hide();
        this.character.hide();
        this.characterInfo.hide();
        this.greeting.hide();
        this.message.hide();
    }

    showCharacterElements(){
        this.selectCharacterButton.show();
        this.selectCharacterButton.position(windowWidth/2, windowHeight/3+200);
        this.characterScrollInstr.show();
        this.characterScrollInstr.position(windowWidth/2-120, 50);
        this.character.show();
        this.character.position(windowWidth/3, 100)
        this.characterInfo.show();
        this.characterInfo.position(windowWidth/3, 200)
    }

    display(){
        this.hideForHome();
        this.showHomeComp();
        this.resetButton.show();
        this.resetButton.position(camera.position.x+displayWidth+150, camera.position.y+displayHeight)

        this.playButton.mousePressed(()=>{
            player.name = this.nameInput.value();
            playerCount+=1;
            player.index = playerCount;
            player.update();
            player.updateCount(playerCount);
            this.hideHomeComp();
            this.greeting.show();
            this.greeting.position(windowWidth/2+50, 100);
            this.greeting.html("Hi "+player.name);
            this.message.show();
            this.message.position(windowWidth/2, windowHeight/2);
        })

        this.characterButton.mousePressed(()=>{
            this.lock = false;
            this.hideHomeComp();
            this.showCharacterElements();
        })

        this.selectCharacterButton.mousePressed(()=>{
            this.lock = true;
            this.hideForHome();
            this.showHomeComp();
        })

        this.resetButton.mousePressed(()=>{
            game.endEverything();
        })
    }
}