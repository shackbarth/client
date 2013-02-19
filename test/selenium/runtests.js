/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
//----- Link file with driver to launch web driver for different environments ---------
(function () {
  "use strict";
  var webdriver = require('wd'),
    login = require('./lib/login.js'),
    loginData = require('./lib/loginData.js'),
    createContact_FFnC = require('./lib/createContactForFFnC.js'),
    createContact_Android = require('./lib/createContactForAndroid.js'),
    createContact_FFonWin8 = require('./lib/createContactForFFonWin8.js'),
    createContact_Iphone = require('./lib/createContactForIphone.js'),
    readContact_Iphone = require('./lib/readContactForIphone.js'),
    readContact_FFnC = require('./lib/readContactForFFnC.js'),
    readContact_Android = require('./lib/readContactForAndroid.js'),
    readContact_FFonWin8 = require('./lib/readContactForFFonWin8.js'),
    time = require('./lib/utils.js'),
    sldriver = webdriver.remote(
      "ondemand.saucelabs.com",
      80,
      loginData.data.suname,
      loginData.data.sakey),
    desiredcaps = require('./environments.js'),
    browserdriver = webdriver.remote();
  browserdriver.on('status', function (info) {
    time.getDate(function (date) {
      console.log(date);
      console.log('\x1b[36m%s\x1b[0m', info);
    });
  });
  browserdriver.on('command', function (meth, path) {
    console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
  });
  sldriver.on('status', function (info) {
    time.getDate(function (date) {
      console.log(date);
      console.log('\x1b[36m%s\x1b[0m', info);
    });
  });
  sldriver.on('command', function (meth, path) {
    console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
  });
  module.exports = {
    'chrome on Ubuntu' : function (test1) {
      console.log('starting first test on chrome');
      starttest(desiredcaps.caps[0], 'user1', test1);
    },
    'firefox on Ubuntu' : function (test2) {
      console.log('starting second test on firefox');
      starttest(desiredcaps.caps[1], 'user2', test2);
    },
    'chrome on Mac' : function (test3) {
      console.log('starting third test on Android');
      starttest(desiredcaps.caps[2], 'user3', test3);
    }
  };
  var starttest = function (caps, fname, test) {
    try {
      if ((caps.platform === "Windows XP") || (caps.platform === "Windows 7") || (caps.platform === "Ubuntu")) {
        if ((caps.browserName === "firefox") || (caps.browserName === "chrome")) {
          login.login(sldriver, caps, test, function (sldriver, test) {
            createContact_FFnC.createContact(sldriver, test, fname, function (sldriver, test) {
              readContact_FFnC.readContact(sldriver, test, fname, function (sldriver, test) {
                setTimeout(function () {
                  sldriver.quit();
                  setTimeout(function () {
                    test.done();
                  }, 2000);
                }, 2000);
              });
            });
          });
        }
      }
      else if ((caps.platform === "Linux") || (caps.platform === "Mac 10.6") || (caps.platform === "Mac 10.8") || (caps.platform === "Windows 8")) {
        if (caps.platform === "Windows 8") {
          login.login(sldriver, caps, test, function (sldriver, test) {
            createContact_FFonWin8.createContact(sldriver, test, fname, function (sldriver, test) {
              readContact_FFonWin8.readContact(sldriver, test, fname, function (sldriver, test) {
                setTimeout(function () {
                  sldriver.quit();
                  setTimeout(function () {
                    test.done();
                  }, 2000);
                }, 2000);
              });
            });
          });
        }
        else {
          if ((caps.browserName === "firefox") || (caps.browserName === "chrome") || (caps.browserName === "internet explorer") || (caps.browserName === "safari")) {
            login.login(sldriver, caps, test, function (sldriver, test) {
              createContact_FFnC.createContact(sldriver, test, fname, function (sldriver, test) {
                readContact_FFnC.readContact(sldriver, test, fname, function (sldriver, test) {
                  setTimeout(function () {
                    sldriver.quit();
                    setTimeout(function () {
                      test.done();
                    }, 2000);
                  }, 2000);
                });
              });
            });
          }
          else if (caps.browserName === "android") {
            login.login(sldriver, caps, test, function (sldriver, test) {
              createContact_Android.createContact(sldriver, test, fname, function (sldriver, test) {
                readContact_Android.readContact(sldriver, test, fname, function (sldriver, test) {
                  setTimeout(function () {
                    sldriver.quit();
                    setTimeout(function () {
                      test.done();
                    }, 2000);
                  }, 2000);
                });
              });
            });
          }
          else if ((caps.browserName === "iphone") || (caps.browserName === "ipad")) {
            login.login(sldriver, caps, test, function (sldriver, test) {
              createContact_Iphone.createContact(sldriver, test, fname, function (sldriver, test) {
                readContact_Iphone.readContact(sldriver, test, fname, function (sldriver, test) {
                  setTimeout(function () {
                    sldriver.quit();
                    setTimeout(function () {
                      test.done();
                    }, 2000);
                  }, 2000);
                });
              });
            });
          }
          else
          {
            console.log('No valid browser');
          }
        }
      }
    }
    catch (e) {
      console.log('Exception in starting test' + e);
    }
  };
}());
    
