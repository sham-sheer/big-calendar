import { Client } from "@microsoft/microsoft-graph-client";
import { PageIterator } from "@microsoft/microsoft-graph-client/lib/src/tasks/PageIterator";

const OUTLOOK_APPLICATION_ID = '8f81c6fd-0bf6-4b44-9c6a-32fe75795c4d';
const OUTLOOK_OAUTH_ENDPOINT = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?`;
const OUTLOOK_SCOPES = 'openid profile User.Read Calendars.Read Calendars.Read.Shared Calendars.ReadWrite Calendars.ReadWrite.Shared';
const REDIRECT_URI = 'http://localhost:3000/outlook-redirect';

const params = (data) => {
  return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
};

const guid = () => {
  var buf = new Uint16Array(8);

  var cryptObj = window.crypto || window.msCrypto; // For IE11
  if (cryptObj === undefined || cryptObj.getRandomValues === 'undefined') {
    console.log("browser unsupported! deal with this later");
    return;
  }

  cryptObj.getRandomValues(buf);
  function s4(num) {
    var ret = num.toString(16);
    while (ret.length < 4) {
      ret = '0' + ret;
    }
    return ret;
  }
  return s4(buf[0]) + s4(buf[1]) + '-' + s4(buf[2]) + '-' + s4(buf[3]) + '-' +
      s4(buf[4]) + '-' + s4(buf[5]) + s4(buf[6]) + s4(buf[7]);
};

export const getAccessToken = (callback) => {
  var now = new Date().getTime();
  var isExpired = now > parseInt(window.localStorage.getItem('outlook_expiry'));
  // Do we have a token already?
  if (window.localStorage.getItem('outlook_access_token') && !isExpired) {
    // Just return what we have
    if (callback) {
      callback(window.localStorage.getItem('outlook_access_token'));
    }
  } else {
    // Attempt to do a hidden iframe request
    // makeSilentTokenRequest(callback);
    console.log("Access token expired!!");
  }
};

export const getUserEvents = (callback) => {
  getAccessToken((accessToken) => {
    if (accessToken) {
      // Create a Graph client
      var client = Client.init({
        authProvider: (done) => {
          // Just return the token
          done(null, accessToken);
        }
      });

      var id = "";
      
      // This first select is to choose from the list of calendars 
      client
        .api('/me/calendars')
        .get(async (err, res) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(res);
            // We are hard coding to select from keith's calendar first. but change this for production. LOL
            // By default, can use 0 coz should have a default calendar. 
            id = res.value[3].id;

            var allEvents = await loadOutlookEventsChunked(client, id);
            callback(allEvents);
          }
        });
    } else {
      var error = { responseText: 'Could not retrieve access token' };
      callback(null, error);
    }
  });
};

async function loadOutlookEventsChunked (client, id) {
  var allEvents = [];

  try {
    // Makes request to fetch mails list. Which is expected to have multiple pages of data.
    let response = await client
      .api(`/me/calendars/${id}/events`)
      .count(true)
      .select('attendees, bodyPreview, changeKey, createdDateTime, end, iCalUId, id, isAllDay, organizer, lastModifiedDateTime, location, originalEndTimeZone, originalStart, originalStartTimeZone, recurrence, responseStatus, start, subject, webLink')
      .orderby('createdDateTime DESC')
      .get();

    // Creating a new page iterator instance with client a graph client instance, page collection response from request and callback
    let pageIterator = new PageIterator(client, response, (data) => {
      allEvents.push(data);

      if(allEvents.length !== response['@odata.count']){
        return true; 
      }
      return false;
    });
    
    // This iterates the collection until the nextLink is drained out.
    // Wait till all the iterator are done
    await pageIterator.iterate();
    return allEvents;
  } catch (e) {
    throw e;
  }
}

export const buildAuthUrl = () => {
  // Generate random values for state and nonce
  sessionStorage.authState = guid();
  sessionStorage.authNonce = guid();
  
  var authParams = {
    response_type: 'id_token token',
    client_id: OUTLOOK_APPLICATION_ID,
    redirect_uri: REDIRECT_URI,
    scope: OUTLOOK_SCOPES,
    state: sessionStorage.authState,
    nonce: sessionStorage.authNonce,
    response_mode: 'fragment'
  };
  
  return OUTLOOK_OAUTH_ENDPOINT + params(authParams);
};

const parseHashParams = (hash) => {
  var params = hash.slice(1).split('&');
    
  var paramarray = {};
  params.forEach(function(param) {
    param = param.split('=');
    paramarray[param[0]] = param[1];
  });
    
  return paramarray;
};

export const PopupCenter = (url, title, w, h) => {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  var dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  //eslint-disable-next-line
  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  //eslint-disable-next-line
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  var systemZoom = width / window.screen.availWidth;
  var left = (width - w) / 2 / systemZoom + dualScreenLeft;
  var top = (height - h) / 2 / systemZoom + dualScreenTop;
  var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (window.focus) newWindow.focus();
};

