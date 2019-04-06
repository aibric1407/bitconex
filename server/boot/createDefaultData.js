"use strict";

module.exports = async function(app) {
  var Tech = app.models.Tech;
  var Device = app.models.Device;
  var Product = app.models.Product;

  /**
   * @function createDefaultData
   * @description Creates default data for techs, devices and packages
   */
  app.createDefaultData = async function() {
    // Create default data for tech if data does not exist
    var all_techs = await Tech.find();
    if (!all_techs.length) {
      console.log(":: Create default data for techs");
      var techList = app.get("techList");
      var techPromises = [];
      for (var ti in techList) {
        techPromises.push(
          Tech.create({
            type: techList[ti]
          })
        );
      }

      Promise.all(techPromises)
        .then(res => {
          console.log(":: Default data for techs crated successfully ");
        })
        .catch(err => {
          console.log(":: Default data for techs failed with error: ", err);
        });
    }

    // Create default data for devices if data not created
    var all_devices = await Device.find();
    if (!all_devices.length) {
      console.log(":: Create default data for devices");
      var deviceList = app.get("deviceList");
      var devicePromises = [];
      for (var di in deviceList) {
        devicePromises.push(
          Device.create({
            type: deviceList[di]
          })
        );
      }

      Promise.all(devicePromises)
        .then(res => {
          console.log(":: Default data for devices crated successfully ");
        })
        .catch(err => {
          console.log(":: Default data for devices failed with error: ", err);
        });
    }

    // Create default data for packages if data not created
    var packages = await Product.find();
    if (!packages.length) {
      console.log(":: Create default data for packages");
      var upstreams = app.get("upstream");
      var downstreams = app.get("downstream");
      var devices = await Device.find();
      var techs = await Tech.find();
      // Create packages for each upstream, downstream, tech and device
      var packagePromises = [];
      for (var i in downstreams) {
        for (var j in upstreams) {
          for (var k in devices) {
            for (var l in techs) {
              packagePromises.push(
                Product.create({
                  downstream: downstreams[i],
                  upstream: upstreams[j],
                  device_id: devices[k].id,
                  tech_id: techs[l].id
                })
              );
            }
          }
        }
      }

      Promise.all(packagePromises)
        .then(res => {
          console.log(":: Default data for packages crated successfully ");
          app.wsrvr = app.start();
        })
        .catch(err => {
          console.log(":: Default data for packages failed with error: ", err);
        });
    } else {
      app.start();
    }
  };
};
