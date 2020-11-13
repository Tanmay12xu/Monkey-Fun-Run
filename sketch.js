var PLAY = 1;
var END = 0;
var gameState = PLAY;
var monkey, monkey_running, monkey_stop;
var banana, bananaImage, FoodGroup;
var obstacle, obstacleImage, obstacleGroup;
var score = 0;
var collect = 0;
var ground;

function preload() {

  //load animations to the monkey
  monkey_run = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
  monkey_stop = loadAnimation("sprite_2.png");

  //load animations to the obstacles and bananas
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");

}

function setup() {
  createCanvas(600, 400);

  //creating monkey 
  monkey = createSprite(80, 315, 20, 20);
  monkey.addAnimation("running", monkey_run);
  monkey.scale = 0.1;

  //creating ground
  ground = createSprite(400, 350, 900, 10);
  ground.velocityX = -4;
  ground.x = ground.width / 2;
  console.log(ground.x);

  //creating groups of groups
  obstacleGroup = createGroup();
  FoodGroup = createGroup();

  //
  monkey.setCollider("rectangle", 0, 0, monkey.width, monkey.height);
  monkey.debug = true;

  score = 0;
  collect = 0;

}

function draw() {

  background("grey");
  textSize = 7;
  text("Survival Time: " + score, 500, 50);
  text("Bananas Collect: " + collect, 350, 50);

  if (gameState === PLAY) {

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    score = score + Math.round(frameRate() / 60);

    //jump when the space key is pressed
    if (keyDown("space") && monkey.y >= 300) {
      monkey.velocityY = -14;
    }

    if (FoodGroup.isTouching(monkey)) {
      FoodGroup.destroyEach();
      collect = collect + 1
    }

    monkey.velocityY = monkey.velocityY + 0.8;
    monkey.collide(ground);

    obstacles();

    spawnBananas();

    if (obstacleGroup.isTouching(monkey)) {
      //trex.velocityY = -12;
      gameState = END;
    }
  } else if (gameState === END) {

    if (keyDown("r")) {
      reset();
    }

    monkey.collide(ground);
    monkey.changeAnimation("over", monkey_stop);

    ground.velocityX = 0;
    monkey.velocityY = 0;

    obstacleGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(-1);

    obstacleGroup.setVelocityXEach(0);
    FoodGroup.setVelocityXEach(0);

  }

  drawSprites();
}


function obstacles() {
  if (frameCount % 80 === 0) {
    obstacle = createSprite(600, 325, 20, 20);
    obstacle.x = Math.round(random(600, 700));
    obstacle.velocityX = -6;
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.1;
    obstacle.lifetime = -1;
    obstacleGroup.add(obstacle);
  }
}

function spawnBananas() {
  if (frameCount % 180 === 0) {
    banana = createSprite(600, 300, 40, 10);
    banana.y = Math.round(random(200, 220));
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.velocityX = -5;
    banana.lifetime = 200;
    FoodGroup.add(banana);
  }
}

function reset() {
  gameState = PLAY;
  /*gameOver.visible = false;
  restart.visible = false;*/
  obstacleGroup.destroyEach();
  FoodGroup.destroyEach();
  monkey.changeAnimation("running", monkey_run);
  score = 0;
  collect = 0;
}