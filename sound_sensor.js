var tessel = require('tessel');
var ambientLib = require('ambient-attx4');
var ambient = ambientLib.use(tessel.port['A']);

Sound = {
  addTrigger: function(level, callback) {
    ambient.setSoundTrigger(level);

    ambient.on('sound-trigger', function() {
      callback()

      ambient.clearSoundTrigger();

      setTimeout(function () {
        ambient.setSoundTrigger(level);
      }, 1500);
    });
  },

  start: function(callback) {
    this.callback = callback;
    this.runningTotal = 0;
    this.values = [];
    self = this;
    ambient.pollingFrequency = 100;

    ambient.on('ready', function () {
      ambient.on('sound', function (soundData) {
        // console.log(soundData[0]);
        // self.update(soundData[0]);
        callback(soundData[0])
      });
    });
  },

  update: function(value) {
    this.values.push(value);
    oldVal = 0;

    if (this.values.length > 10) {
      oldVal = this.values.shift();
    }

    this.runningTotal = this.runningTotal - oldVal + value;

    // console.log('======' + this.runningTotal / this.values.length);

    this.callback(this.runningTotal / this.values.length);
  }
}

module.exports = Sound;
