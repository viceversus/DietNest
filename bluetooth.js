var tessel = require('tessel');
var bluetoothLib = require('ble-ble113a');
var bleAdvertise = require('bleadvertise');

Bluetooth = {
  start: function() {
    var packet = {
      flags: [0x02, 0x04], // Connectable, BLE only
      incompleteUUID128: ['d752c5fb13804cd5b0efcac7d72cff20'], // Tessel Firmware Version Service UUID
      shortName: 'Tessel'
    }

    var ad = bleAdvertise.serialize(packet);

    peripheral = bluetoothLib.use(tessel.port['D'], function() {
      peripheral.setAdvertisingData(ad, function() {
        peripheral.startAdvertising();
        console.log('Now advertising');
      });

      peripheral.on('connect', function(connectionId){
        console.log('Connected to central device');
      });

      peripheral.on('remoteNotification', function(connectionId, index) {
        console.log('Notifications started');
        var count = 0;

        setInterval(function() {
          peripheral.writeLocalValue(index, new Buffer(count.toString())); // Write to [index] transceiver value
          count++;
        }, 2000);
      });

      peripheral.on('characteristicWrite', function(characteristicWritten, valueWritten) {
        console.log('Characteristic ' + characteristicWritten + ' written');
        console.log(valueWritten);
      })

      peripheral.on('descriptorWrite', function(descriptorWritten, valueWritten) {
        console.log('descriptor ' + descriptorWritten + ' written');
        console.log(valueWritten);
      })
    });
  }
}

module.exports = Bluetooth;
