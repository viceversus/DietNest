var Sound = require('./sound_sensor');
var Servo = require('./servo');
var Bluetooth = require('./bluetooth');

var maxSoundLevel = 0.25

var servo1 = new Servo(1, initializeArm);
var momentServo = new Servo(2, initializeMoment)
var turntable = new Servo(3, startTurntable);

function initializeArm() {
  servo1.move(0.5);
}

function initializeMoment() {
  momentServo.move(0.50);
}

function startTurntable() {
  turntable.move(0.5);
}

Sound.addTrigger(0.05, function() {
  console.log('MOMENT');
  momentServo.lock();
  momentServo.move(0);

  setTimeout(function() { momentServo.unlock(); }, 1000)
})

Sound.start(function(level) {
  console.log(level);
  value = level / maxSoundLevel;

  if (value > 1) {
    console.log('============ NEW MAX ==============')
    value = 1;
  }

  servo1.move(value);
});

Bluetooth.start();
