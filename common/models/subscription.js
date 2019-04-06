"use strict";

module.exports = function(Subscription) {
  var app = require("../../server/server");

  /**
   * @function beforeRemote - activateSubscription
   * @description Check if request is valid. If subscription already exists push it into History
   * and then proceed with activateSubscription method. Otherwise proceed.
   */
  Subscription.beforeRemote("activateSubscription", function(ctx, user, next) {
    var History = app.models.History;

    if (!ctx.args.req) {
      next(
        new Error(
          "Activate subscription failed: Please provide user_id and product_id"
        )
      );
      return;
    }
    Subscription.findOne({
      where: {
        user_id: ctx.args.req.user_id
      }
    })
      .then(existingSubs => {
        if (existingSubs) {
          History.create({
            user_id: existingSubs.user_id,
            product_id: existingSubs.product_id,
            date: existingSubs.date
          }).then(res => {
            Subscription.destroyById(existingSubs.id);
            next();
          });
        } else {
          next();
        }
      })
      .catch(err => {
        next(new Error("Activate subscription failed: " + err));
      });
  });

  /**
   * @description Check if params are valid and if wanted product is in system. If conditions are met
   * create new subscription for user
   * @method activateSubscription
   * @example POST http://localhost:3000/api/Subscriptions/activate-subscription?req={"user_id": 123, "product_id": 12}
   * @param req requst object with user_id and product_id
   * @param cb callback function
   * @returns message
   */
  Subscription.activateSubscription = function(req, cb) {
    var Product = app.models.Product;
    if (!req.user_id || !req.product_id) {
      cb(
        new Error(
          "Activate subscription failed: Please provide user_id and product_id"
        )
      );
      return;
    }
    Product.findById(req.product_id)
      .then(product => {
        if (!product) {
          cb(
            new Error(
              "Activate subscription failed: There is no product with id " +
                req.product_id
            )
          );
        } else {
          Subscription.create({
            user_id: req.user_id,
            product_id: req.product_id,
            date: new Date()
          })
            .then(res => {
              cb(null, "Activate subscription successful");
            })
            .catch(err => {
              cb(new Error("Activate subscription failed: " + err));
            });
        }
      })
      .catch(err => {
        cb(new Error("Activate subscription failed: " + err));
      });
  };

  Subscription.remoteMethod("activateSubscription", {
    description: "Create new subscription for user",
    accepts: { arg: "req", type: "object" },
    returns: { arg: "message", type: "object" },
    http: { path: "/activate-subscription", verb: "post" }
  });

  /**
   * @description Fetch active subscriptions for all users. Include tech and device details
   * @method getActiveSubscriptions
   * @example GET http://localhost:3000/api/Subscriptions/subscriptions
   * @param cb callback function
   * @returns subscriptions list of active subscriptions for all users
   */
  Subscription.getActiveSubscriptions = function(cb) {
    Subscription.find({
      include: {
        product: ["tech", "device"]
      }
    })
      .then(subs => {
        cb(null, subs);
      })
      .catch(err => {
        cb(err);
      });
  };
  Subscription.remoteMethod("getActiveSubscriptions", {
    description: "Fetch active subscriptions for all users.",
    returns: { arg: "subscriptions", type: "object" },
    http: { path: "/subscriptions", verb: "get" }
  });

  /**
   * @description Fetch active subscription for wanted user id. Include tech and device details.
   * @method getActiveUserSubscription
   * @example GET http://localhost:3000/api/Subscriptions/user-subscription?user_id=123
   * @param user_id user id
   * @param cb callback function
   * @returns subscription active subscription for wanted users
   */
  Subscription.getActiveUserSubscription = function(user_id, cb) {
    if (!user_id) {
      cb(new Error("Fetch user subscription failed: Please provide user id!"));
      return;
    }
    Subscription.find({
      where: {
        user_id: user_id
      },
      include: {
        product: ["tech", "device"]
      }
    })
      .then(subs => {
        cb(null, subs);
      })
      .catch(err => {
        cb(err);
      });
  };
  Subscription.remoteMethod("getActiveUserSubscription", {
    description: "Fetch active subscription for wanted user id.",
    accepts: { arg: "user_id", type: "string" },
    returns: { arg: "subscription", type: "object" },
    http: { path: "/user-subscription", verb: "get" }
  });

  /**
   * @description Fetch subscriptions history for all users. Include tech and device details
   * @method getSubscriptionsHistory
   * @example GET http://localhost:3000/api/Subscriptions/subscription-history
   * @param cb callback function
   * @returns subscription subscription history for all users
   */
  Subscription.getSubscriptionsHistory = function(cb) {
    var History = app.models.History;

    History.find({
      include: {
        product: ["tech", "device"]
      }
    })
      .then(subs => {
        cb(null, subs);
      })
      .catch(err => {
        cb(err);
      });
  };
  Subscription.remoteMethod("getSubscriptionsHistory", {
    description: "Fetch subscriptions history for all users.",
    returns: { arg: "subscriptions", type: "object" },
    http: { path: "/subscriptions-history", verb: "get" }
  });

  /**
   * @description Fetch subscription history for wanted user id. Include tech and device details.
   * @method getSubscriptionHistoryForUser
   * @example GET http://localhost:3000/api/Subscriptions/user-subscription-history?user_id=123
   * @param user_id user id
   * @param cb callback function
   * @returns subscription subscription history for wanted users
   * */
  Subscription.getSubscriptionHistoryForUser = function(user_id, cb) {
    if (!user_id) {
      cb(new Error("Fetch user subscription failed: Please provide user id!"));
      return;
    }
    var History = app.models.History;
    History.find({
      where: {
        user_id: user_id
      },
      include: {
        product: ["tech", "device"]
      }
    })
      .then(subs => {
        cb(null, subs);
      })
      .catch(err => {
        cb(err);
      });
  };
  Subscription.remoteMethod("getSubscriptionHistoryForUser", {
    description: "Fetch subscription history for wanted user id.",
    accepts: { arg: "user_id", type: "string" },
    returns: { arg: "subscriptions", type: "object" },
    http: { path: "/user-subscription-history", verb: "get" }
  });
};
