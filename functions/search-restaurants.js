'use strict';

const co = require("co");
const aws4 = require('aws4');
const URL = require('url');

const http = require('superagent-promise')(require('superagent'),Promise);
const restaurantApiUrl = process.env.restaurants_api;

function* getRestaurants(){
    let url = URL.parse(restaurantApiUrl);
    let opts = {
      host: url.hostname,
      path: url.pathname
    };
  
    aws4.sign(opts);
  
    return (yield http  
    .get(restaurantApiUrl)
    .set('Host',opts.headers['Host'])
    .set('X-Amz-Date',opts.headers['X-Amz-Date'])
    .set('Authorization',opts.headers['Authorization'])
    .set('X-Amz-Security-Token',opts.headers['X-Amz-Security-Token'])
    ).body;
  }

module.exports.handler = co.wrap(function* (event, context, cb){
    let restaurants = yield getRestaurants();
    let response = {
      statusCode: 200,
      body: JSON.stringify(restaurants)
    };

    cb(null, response);
});