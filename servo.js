var tessel = require('tessel');
var servolib = require('servo-pca9685');
var servo = servolib.use(tessel.port['C']);

Servo = function(servoPosition, cb) {
  this.servoPosition = servoPosition;

  servo.on('ready', function() {
    servo.configure(servoPosition, 0.05, 0.12, cb);
  });

  this.lock = function() {
    this.locked = true;
  };

  this.unlock = function() {
    this.locked = false;
  }

  this.move = function(val) {
    if (!this.locked) {
      servo.move(this.servoPosition, val);
    }
  }
}

module.exports = Servo;
