var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var cloud,cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;
var highScore = 0; 

function preload(){
  mario_running = loadAnimation("mr1.png","mr2.png","mr3.png","mr4.png","mr5.png","mr6.png","mr6p.png","mr7.png","mr8.png","mr9.png","mr10.png");
  mario_collided = loadAnimation("mr6p.png");
  
  groundImage = loadImage("panorama img.jpg");
  
  cloudImage = loadAnimation("sprite_00.png","sprite_01.png","sprite_02.png","sprite_03.png","sprite_04.png","sprite_05.png","sprite_06.png","sprite_07.png","sprite_08.png","sprite_09.png","sprite_10.png","sprite_11.png","sprite_12.png","sprite_13.png","sprite_15.png","sprite_16.png","sprite_17.png","sprite_18.png","sprite_19.png","sprite_20.png","sprite_21.png","sprite_22.png","sprite_23.png","sprite_24.png","sprite_25.png","sprite_26.png","sprite_27.png","sprite_28.png","sprite_29.png");
  
  obstacle1 = loadImage("X1.png");
  obstacle2 = loadImage("OB2.png");
  obstacle3 = loadImage("OB3.png");
  obstacle4 = loadImage("X4.png");
  obstacle5 = loadImage("OB2.png");
  obstacle6 = loadImage("OB3.png");
  obstacle7 = loadImage("X7.png");
  obstacle8 = loadImage("X8.png");
  obstacle9 = loadImage("X9.png");
  
  restartImg = loadImage("restart1.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 600);

  var message = "This is a message";
 console.log(message)
  
  
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  mario = createSprite(50,260,20,50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  

  mario.scale = 0.2;

  gameOver = createSprite(300,150);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,200);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.2;
  
  invisibleGround = createSprite(200,280,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  mario.setCollider("rectangle",0,0,mario.width-80,mario.height-50);
  mario.debug = true
  
  score = 0;
  
  //restart.debug = true;
 
  
}

function draw() {
  
  background(255);
  //displaying score
  
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    //score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& mario.y >= 161) {
        mario.velocityY = -12;
        
    }
    
    //add gravity
    mario.velocityY = mario.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(mario)){
        //trex.velocityY = -12;
        
        gameState = END;
        dieSound.play();
      
    }
    if(cloudsGroup.isTouching(mario)){
      score= score+5;
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      mario.changeAnimation("collided", mario_collided);
    
     
     
      ground.velocityX = 0;
      mario.velocityY = 0;
     
     if(mousePressedOver(restart)) {
      reset();
    }
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
  
 
  //stop trex from falling down
  mario.collide(invisibleGround);
  
  


  drawSprites();
  text("Score: "+ score, 500,50);
  text("HighScore: " + highScore,400,50);
}

function reset(){
  gameState = PLAY ;
  gameOver.visible = false;
  restart.visible = false;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  mario.changeAnimation("running",mario_running);
  if (score > highScore){
    highScore  = score;
  }
  score = 0 ;
  

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,260,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,9));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      case 7: obstacle.addImage(obstacle7);
              break;
      case 8: obstacle.addImage(obstacle8);
              break;
      case 9: obstacle.addImage(obstacle9);
              break;        
      default: break;

    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstacle.debug = true;
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addAnimation("Coin",cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}