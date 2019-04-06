"use strict";

module.exports = function(Product) {
  /**
   * @description Fetch all products. Include tech and device details
   * @method allProducts
   * @example GET http://localhost:3000/api/Products/list
   * @param cb callback function
   * @returns subscriptions list of active subscriptions for all users
   */
  Product.allProducts = function(cb) {
    Product.find({
      include: ["tech", "device"]
    })
      .then(subs => {
        cb(null, subs);
      })
      .catch(err => {
        cb(err);
      });
  };
  Product.remoteMethod("allProducts", {
    description: "Fetch all products. Include tech and device details",
    returns: { arg: "products", type: "object" },
    http: { path: "/list", verb: "get" }
  });
};
