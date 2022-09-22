var player,
  platforms,
  glasses,
  keyH,
  hBox,
  hText,
  hOpened = "false",
  keyP,
  keyY,
  keyN,
  pBox,
  pText,
  pOpened = "false",
  graphics,
  sun,
  vec,
  path,
  hit,
  wasHit = 0,
  goBox,
  goText,
  lives = 3,
  gameOver = "false";
class GameScene extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  preload() {
    this.load.image("background", "./assets/images/background.png");
    this.load.image("platform", "./assets/images/platform.png");
    this.load.image("glasses", "./assets/images/glasses.png");
    this.load.image("sun", "./assets/images/sun.png");
    this.load.spritesheet("player", "./assets/images/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.image("hBox", "./assets/images/hBox.png");
    this.load.image("hText", "./assets/images/hText.png");
    this.load.image("pText", "./assets/images/pText.png");
    this.load.image("goText", "./assets/images/gameOver.png");
    this.load.audio("hit", ["./assets/sounds/hit.wav"]);
  }

  create() {
    var score = 0;
    var scoreText;
    var livesText;
    var rnd = Phaser.Math.RND;
    keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
    keyN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);

    this.add.image(400, 300, "background");
    platforms = this.physics.add.staticGroup();

    platforms.create(600, 300, "platform");
    platforms.create(50, 150, "platform");
    platforms.create(750, 120, "platform");
    platforms.create(400, 490, "platform").setScale(2).refreshBody();

    scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
    });
    livesText = this.add.text(16, 48, "Lives: 3", {
      fontSize: "32px",
      fill: "#000",
    });

    player = this.physics.add.sprite(100, 350, "player");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(300);
    this.physics.add.collider(player, platforms);

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 7 }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 8, end: 15 }),
      frameRate: 20,
      repeat: -1,
    });

    glasses = this.physics.add.group({
      key: "glasses",
      repeat: 0,
      setXY: {
        x: player.x < 400 ? rnd.between(425, 750) : rnd.between(50, 375),
        y: rnd.between(0, 300),
      },
    });
    this.physics.add.collider(glasses, platforms);

    this.physics.add.overlap(player, glasses, collect, null, this);
    function collect(player, star) {
      star.disableBody(true, true);
      score += 10;
      scoreText.setText("Score: " + score);
      glasses.create(
        player.x < 400 ? rnd.between(425, 750) : rnd.between(50, 375),
        rnd.between(0, 300),
        "glasses"
      );
    }
    graphics = this.add.graphics();
    path = new Phaser.Curves.Path(250, 700);
    path.lineTo(600, 700);
    path.lineTo(100, 600);
    path.lineTo(600, 500);
    path.lineTo(100, 375);
    path.lineTo(600, 350);

    sun = this.add.follower(path, 250, 400, "sun");
    sun.startFollow({
      duration: 10000,
      yoyo: true,
      repeat: -1,
      rotateToPath: false,
      verticalAdjust: true,
    });
    this.physics.world.enable(sun);

    hit = this.sound.add("hit", { loop: false });
    this.physics.add.collider(player, sun, getHit, null, this);
    function getHit() {
      if (wasHit < this.time.now) {
        console.log("Hit");
        hit.play();
        lives -= 1;
        livesText.setText("Lives: " + lives);
        // sun.disableBody(true, true);
        wasHit = this.time.now + 1500;
      }
    }
  }

  update() {
    var cursors;
    //  this.input.keyboard.on("keydown-N", () => this.handleNewGame(hBox));
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      player.setVelocityX(-260);
      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(260);
      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);
      player.anims.stop(null, true);
    }

    if (cursors.space.isDown && player.body.touching.down) {
      player.setVelocityY(-530);
    }
    if (keyH.isDown) {
      if (hOpened == "false") {
        console.log("H");
        hBox = this.add.image(400, 300, "hBox");
        hText = this.add.image(400, 300, "hText");
        hOpened = "true";
      }
    }
    if (keyP.isDown) {
      if (pOpened == "false") {
        console.log("P");
        pBox = this.add.image(400, 300, "hBox");
        pText = this.add.image(400, 300, "pText");
        pOpened = "true";
      }
    }
    if (keyN.isDown) {
      if (pOpened == "true") {
        pBox.destroy();
        pText.destroy();
        pOpened = "false";
      }
    }
    if (keyY.isDown) {
      if (pOpened == "true") {
        pOpened = "false";
        lives = 3;
        gameOver = "false";
        this.scene.start("TitleScreen");
      }
    }

    this.input.keyboard.on("keydown", () => this.closeHelp(hBox));
    if (lives == 0) {
      if (gameOver != "true") {
        goBox = this.add.image(400, 300, "hBox");
        goText = this.add.image(400, 300, "goText");
        console.log("game over");
        gameOver = "true";
      }
    }
  }

  closeHelp(hBox) {
    if (hOpened == "true") {
      hBox.destroy();
      hText.destroy();
      console.log("closed");
      hOpened = "false";
    }
  }
}
