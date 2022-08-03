
var config = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [TitleScreen, GameScene],
};
var game = new Phaser.Game(config);
game.scene.start('TitleScreen');
console.log("Got here ");
