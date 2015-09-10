var tessel = require('tessel');
var servolib = require('servo-pca9685');
var ambientlib = require('ambient-attx4');
var Bacon = require('baconjs');
var NoiseTransformer = require('./noise_transformer');
require('q');

var ambient = ambientlib.use(tessel.port['A']);
var servo = servolib.use(tessel.port['C']);

var servo1 = 1;
var servo2 = 2; // We have a servo plugged in at position 1

function Motor(motor) {
  this.motor = motor;
  this.locked = false;
}

Motor.prototype.move = function(index) {
  var promise = Q.defer();
  if(!this.locked) {
    servo.move(this.motor, index);
  }
}

Motor.prototype.showMoment = function() {
  this.locked = true;
  servo.move(this.motor, 1);
  servo.move(this.motor, 0);
  servo.move(this.motor, 1);
  servo.move(this.motor, 0);
  servo.move(this.motor, 1);
  servo.move(this.motor, 0);
  servo.move(this.motor, 1);
  servo.move(this.motor, 0);
  servo.move(this.motor, 1);
  servo.move(this.motor, 0);
  servo.move(this.motor, 1);
  servo.move(this.motor, 0);
  this.locked = false;
}

servo.on('ready', function() {
  servo.configure(servo1, 0.05, 0.12);
  servo.configure(servo2, 0.05, 0.12);
});

var motor = new Motor(servo2);

ambient.on('ready', function () {

  var soundEventStream = Bacon.fromEvent(ambient, 'sound');
  var smoothedSoundEventStream = NoiseTransformer.pipe(soundEventStream);

  ambient.on('sound', function(sdata) {
    console.log(sdata);
    motor.move(sdata[0] * 10);
  });

  ambient.setSoundTrigger(0.1);

  ambient.on('sound-trigger', function(data) {
    servo.move(servo1, 1);

    setTimeout(function() {
      servo.move(servo1, 0);
      motor.showMoment();
    }, 5000);

    // Clear it
    ambient.clearSoundTrigger();

    //After 1.5 seconds reset sound trigger
    setTimeout(function () {
        ambient.setSoundTrigger(0.1);

    }, 10000);

  });
});
