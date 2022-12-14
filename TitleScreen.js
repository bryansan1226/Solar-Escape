var title, message, instructions, sanchezName;
class TitleScreen extends Phaser.Scene {
  constructor() {
    super({ key: "TitleScreen" });
  }

  preload() {
    this.load.image("background", "./assets/images/background.png");
    this.load.image("title", "./assets/images/title.png");
    this.load.image("start", "./assets/images/startButton.png");
    this.load.image("intro", "./assets/images/intro.png");
    this.load.image("instructions", "./assets/images/instructions.png");
    this.load.image("sanchezName", "./assets/images/sanchezName.png");
  }
  create() {
    console.log("In game.js");
    this.add.image(400, 300, "background");
    title = this.add.image(400, 100, "title");
    sanchezName = this.add.image(400, 200, "sanchezName");
    var startButton = this.add
      .image(400, 400, "start")
      .setInteractive()
      .on("pointerdown", () => this.actionOnClick(title, startButton));
  }
  update() {
    var cursors;
    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.space.isDown) {
      this.scene.start("playGame");
    }
  }
  actionOnClick(title, startButton) {
    title.destroy("title");
    startButton.destroy("start");
    sanchezName.destroy("sanchezName");
    message = this.add.image(400, 100, "intro");
    instructions = this.add.image(400, 300, "instructions");
  }
  actionOnOver(startButton) {
    startButton.setTint("#EDE9E8");
  }
}
