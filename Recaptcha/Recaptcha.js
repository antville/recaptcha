// The Antville Project
// http://code.google.com/p/antville
//
// Copyright 2001–2014 by the Workers of Antville.
//
// Licensed under the Apache License, Version 2.0 (the ``License'');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an ``AS IS'' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Defines the Antville reCAPTCHA Feature.
 * @see http://www.google.com/recaptcha
 */

"http://code.google.com/p/antville/wiki/RecaptchaFeature",

Recaptcha.verify = function (data) {
  if (session.user) {
    return;
  }
  var secret = getProperty('trail.recaptcha.secret');
  if (secret) {
    var response = req.postParams['g-recaptcha-response'];
    var ip = req.data.remotehost;
    console.log(ip);
    var mime = getURL('https://www.google.com/recaptcha/api/siteverify?secret=' + secret + '&response=' + response + '&remoteip=' + ip);
    var json = JSON.parse(new java.lang.String(mime.content));
    if (!json.success) {
      throw Error(gettext('Do Androids dream of electric sheep?'));
    }
  }
  return;
};

Recaptcha.prototype.trail_macro = function () {
  if (session.user) {
    return;
  }
  var secret = getProperty('trail.recaptcha.secret');
  if (secret) {
    this.renderSkin('Recaptcha#main');
  }
  return;
};
