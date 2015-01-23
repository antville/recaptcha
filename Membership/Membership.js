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
 * @fileoverview Overwrites the Membership.contact_action() method for inclusion or reCAPTCHA
 * @see http://www.google.com/recaptcha
 */

Membership.prototype.contact_action = function() {
  if (req.postParams.send) {
    try {
      if (!req.postParams.text) {
        throw Error(gettext('Please enter the message text.'));
      }
      Recaptcha.verify(req.postParams);
      this.notify(req.action, this.creator.email, session.user ?
          gettext('[{0}] Message from user {1}', root.title, session.user.name) :
          gettext('[{0}] Message from anonymous user', root.title));
      res.message = gettext('Your message was sent successfully.');
      res.redirect(this._parent.getPermission() ? this._parent.href() : this.site.href());
    } catch(ex) {
      res.message = ex;
      app.log(ex);
    }
  }
  res.data.action = this.href(req.action);
  res.data.title = gettext('Contact {0}', this.name);
  var param = {
    recaptcha: session.user ? String.EMPTY : this.renderSkinAsString('$Recaptcha#main')
  };
  res.data.body = this.renderSkinAsString('$Recaptcha#contact', param);
  this.site.renderSkin('Site#page');
  return;
}
