// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let incognito;
let url;

function settingChanged() {
  let type = this.id;
  let setting = this.value;
  let pattern = /^file:/.test(url) ? url : url.replace(/\/[^/]*?$/, '/*');
  console.log(type + ' setting for ' + pattern + ': ' + setting);
  // HACK: [type] is not recognised by the docserver's sample crawler, so
  // mention an explicit
  // type: chrome.contentSettings.cookies.set - See http://crbug.com/299634
  chrome.contentSettings[type].set({
    primaryPattern: pattern,
    setting: setting,
    scope: incognito ? 'incognito_session_only' : 'regular'
  });
}

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let current = tabs[0];
    incognito = current.incognito;
    url = current.url;
    let types = [
      'cookies',
      'images',
      'javascript',
      'location',
      'popups',
      'notifications',
      'microphone',
      'camera',
      'automaticDownloads',
      // 'storage',
      // 'tabs',
      // 'downloads',
      // 'action',
      // 'author',
      // 'background', 
      // 'browser_specific_settings', 
      // 'chrome_settings_overrides', 
      // 'chrome_url_overrides', 
      // 'commands', 
      // 'content_scripts', 
      // 'content_security_policy', 
      // 'declarative_net_request', 
      // 'default_locale', 
      // 'description',
      // 'developer',
      // 'devtools_page',
      // 'dictionaries',
      // 'externally_connectable',
      // 'homepage_url',
      // 'host_permissions',
      // 'icons',
      // 'incognito',
      // 'manifest_version',
      // 'name',
      // 'offline_enabled',
      // 'omnibox',
      // 'optional_host_permissions',
      // 'optional_permissions',
      // 'options_page',
      // 'options_ui',
      // 'page_action',
      // 'permissions',
      // 'protocol_handlers',
      // 'short_name',
      // 'sidebar_action',
      // 'storage',
      // 'theme',
      // 'theme_experiment',
      // 'user_scripts',
      // 'version',
      // 'version_name',
      // 'web_accessible_resources',
    ];
    types.forEach(function (type) {
      // HACK: [type] is not recognised by the docserver's sample crawler, so
      // mention an explicit
      // type: chrome.contentSettings.cookies.get - See http://crbug.com/299634
      chrome.contentSettings[type] &&
        chrome.contentSettings[type].get(
          {
            primaryUrl: url,
            incognito: incognito
          },
          function (details) {
            document.getElementById(type).disabled = true;
            document.getElementById(type).value = details.setting;
          }
        );
    });
  });

  let selects = document.querySelectorAll('select');
  for (let i = 0; i < selects.length; i++) {
    selects[i].addEventListener('change', settingChanged);
  }
});
