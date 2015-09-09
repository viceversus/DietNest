/*********************************************
This servo module demo turns the servo around
1/10 of its full rotation  every 500ms, then
resets it after 10 turns, reading out position
to the console at each movement.
*********************************************/

var tessel = require('tessel');
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['C']);

var servo1 = 1; // We have a servo plugged in at position 1
var servo2 = 2;

servo.on('ready', function () {
  var position1 = 0;  //  Target position of the servo between 0 (min) and 1 (max).

  var position2 = 1;

  //  Set the minimum and maximum duty cycle for servo 1.
  //  If the servo doesn't move to its full extent or stalls out
  //  and gets hot, try tuning these values (0.05 and 0.12).
  //  Moving them towards each other = less movement range
  //  Moving them apart = more range, more likely to stall and burn out
  servo.configure(servo1, 0.05, 0.12, function () {
    setInterval(function () {
      console.log('Position (in range 0-1):', position);
      //  Set servo #1 to position pos.
      servo.move(servo1, position1);

      // Increment by 10% (~18 deg for a normal servo)
      position1 += 0.1;
      if (position1 > 1) {
        position1 = 0; // Reset servo position
      }
    }, 500); // Every 500 milliseconds
  });

  servo.configure(servo2, 0.05, 0.12, function () {
    setInterval(function () {
      console.log('Position (in range 0-1):', position);
      //  Set servo #1 to position pos.
      servo.move(servo2, position2);

      // Increment by 10% (~18 deg for a normal servo)
      position2 -= 0.1;
      if (position2 < 0) {
        position2 = 1; // Reset servo position
      }
    }, 500); // Every 500 milliseconds
  });
});
