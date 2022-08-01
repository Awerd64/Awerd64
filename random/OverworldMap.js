class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    //Reset NPCs to do their idle behavior
    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}

window.OverworldMaps = {
  HugeHallway: {
    lowerSrc: "maps/HugeHallway.png",
    upperSrc: "maps/CreationUpperRoom.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(15),
        y: utils.withGrid(1),
        src: "people/hero.png"
      }),
      npc: new Person({
        x: utils.withGrid(15),
        y: utils.withGrid(3),
        src: "people/npc.png",
        behaviorLoop: [
          {type: "walk", direction: "left"},
          {type: "stand", direction: "up", time: 60},
          {type: "walk", direction: "up"},
          {type: "walk", direction: "right"},
          {type: "walk", direction: "down"},
        ], 
        talking: [
          {
            events: [
              { type: "textMessage", text: "TFQ", faceHero: "npc"},
            ]
          }
        ] 
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(15,0)]: [
          {
            events: [
               {type: "changeMap", map: "Creation"}
            ]
          }
        ]
    }
  },
  Creation: {
    lowerSrc: "maps/CreationRoom.png",
    upperSrc: "maps/CreationUpperRoom.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        src: "people/hero.png"
      }), npc: new Person({
        x: utils.withGrid(3),
        y: utils.withGrid(6),
        src: "people/npc.png",
          behaviorLoop: [
            {type: "walk", direction: "left"},
            {type: "stand", direction: "up", time: 600},
            {type: "walk", direction: "up"},
            {type: "walk", direction: "right"},
            {type: "walk", direction: "down"},
          ], 
        talking: [
          {
            events: [
              { type: "textMessage", text: "helllo..", faceHero: "npc"},
              { type: "textMessage", text: "how are you ?"},
              { type: "textMessage", text: "fine"},
            ]
          }
        ] 
      }), 
      npc2: new Person({
        x: utils.withGrid(4), 
        y: utils.withGrid(9), 
        src: "people/npc2.png",
        behaviorLoop: [
         {type: "stand", direction: "up", time: 1200},
         {type: "stand", direction: "down", time: 900},
         {type: "stand", direction: "left", time: 300},
         {type: "stand", direction: "right", time: 500},
        ],
        talking: [
          {
            events: [
           {type: "textMessage", text: "yé veux du poulet yé vien d'arrivé en france", faceHero: "npc2"},
             
            ]
          }
        ] 
      }),
      head: new Person({
        x: utils.withGrid(1),
        y: utils.withGrid(9),
        src: "elements/head.png",
        talking: [
          {
            events: [
              {type: "textMessage", text: "Cette chose n'est qu'une cage avec une tête de chat putride à l'intérieur",},
            ]
          }
        ]
      }),
      machine: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(4),
        src: "elements/machine.png",
        talking: [
          {
            events: [
              {type: "textMessage", text: "that is merely a sorta machine",},
            ]
          }
        ]
       }) 
    },
    walls: {
      [utils.asGridCoord(9,9)]: true,
      [utils.asGridCoord(10,9)]: true,
      [utils.asGridCoord(7,7)]: true,
      [utils.asGridCoord(6,7)]: true,
      [utils.asGridCoord(7,4)]: true,
      [utils.asGridCoord(6,4)]: true,
      [utils.asGridCoord(9,7)]: true,
      [utils.asGridCoord(10,7)]: true,
    
      
    },
    cutsceneSpaces: {
      [utils.asGridCoord(5,10)]: [
          {
            events: [
               {type: "changeMap", map: "HugeHallway",}
            ]
          }
        ]
    }
},

}

