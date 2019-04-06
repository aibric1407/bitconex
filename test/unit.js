var app = require("../server/server");
var chai = require("chai");
var expect = chai.expect;

describe("Bitconex api Unit Tests", function() {
  const Subscription = app.models.Subscription;
  const Product = app.models.Product;

  it("Fetching list of products", function() {
    Product.allProducts(function(err, res) {
      if (err) {
        throw new Error(err);
        return;
      }
      expect(res);
    });
  });

  it("Activating subscription with no data", function() {
    Subscription.activateSubscription({}, function(err, res) {
      expect(err);
    });
  });

  it("Activating subscription with data", function() {
    Subscription.activateSubscription({ user_id: 1, product_id: 1 }, function(
      err,
      res
    ) {
      if (err) {
        throw new Error(err);
        return;
      }
      expect(res);
    });
  });

  it("Fetching all users subscriptions", function() {
    Subscription.getActiveSubscriptions(function(err, res) {
      if (err) {
        throw new Error(err);
        return;
      }
      expect(res);
    });
  });

  it("Fetching user subscription", function() {
    Subscription.getActiveUserSubscription(1, function(err, res) {
      if (err) {
        throw new Error(err);
        return;
      }
      expect(res);
    });
  });

  it("Fetching all users subscriptions history", function() {
    Subscription.getSubscriptionsHistory(function(err, res) {
      if (err) {
        throw new Error(err);
        return;
      }
      expect(res);
    });
  });

  it("Fetching user subscription history", function() {
    Subscription.getSubscriptionHistoryForUser(1, function(err, res) {
      if (err) {
        throw new Error(err);
        return;
      }
      expect(res);
    });
  });
});
