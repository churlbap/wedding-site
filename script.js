// Charlotte & Ciaran — site scripts
// Countdown to 3 July 2027, 16:00 local (ceremony time TBC)
(function () {
  var target = new Date(2027, 6, 3, 16, 0, 0); // month index 6 = July
  var ids = { d: 'cd-days', h: 'cd-hours', m: 'cd-mins', s: 'cd-secs' };
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function tick() {
    var now = new Date();
    var diff = target - now;
    var past = diff <= 0;
    if (past) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor(diff / 3600000) % 24;
    var m = Math.floor(diff / 60000) % 60;
    var s = Math.floor(diff / 1000) % 60;
    if (ids.d) document.getElementById(ids.d).textContent = pad(d);
    if (ids.h) document.getElementById(ids.h).textContent = pad(h);
    if (ids.m) document.getElementById(ids.m).textContent = pad(m);
    if (ids.s) document.getElementById(ids.s).textContent = pad(s);
    if (past && ids.s) {
      var el = document.getElementById('countdown');
      if (el) el.querySelector('.hero-kicker') || (el.previousElementSibling.textContent = "We're married!");
    }
  }
  tick();
  setInterval(tick, 1000);
})();

// ---------------------------------------------------------------------
// Form submissions -> Google Sheets (Apps Script web app)
// FORMS_ENDPOINT is filled in once the sheet's web app is deployed.
// ---------------------------------------------------------------------
var FORMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyex1LPWaKFcagAHRs8goNEGXgPQ2DMBSdhE3ZgYaNFGxn6SkUeHHFqAALUBJmVgk8GCg/exec'; // deployed web app
var FORMS_KEY = 'ojfq02d56tis9ch8xmvzegb4';

(function () {
  var form = document.querySelector('form.form-grid');
  if (!form) return;

  // RSVP page has select#attending; interest page has select#option.
  var formType = document.getElementById('attending') ? 'rsvp' : 'interest';

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!FORMS_ENDPOINT) {
      setStatus('RSVP submission isn\'t live quite yet — invitations will follow. Watch this space!');
      return;
    }
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    var fields = {};
    ['name', 'email', 'attending', 'option', 'guests', 'nights', 'notes'].forEach(function (n) {
      var el = form.elements[n];
      if (el) fields[n] = el.value;
    });
    fields.form = formType;
    fields.key = FORMS_KEY;

    fetch(FORMS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors', // Apps Script doesn't return CORS headers; response is opaque but delivered
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids preflight
      body: JSON.stringify(fields)
    })
    .then(function () {
      form.reset();
      setStatus('Thank you! Your response has been received. 💛', true);
    })
    .catch(function () {
      setStatus('Something went wrong sending — please try again in a moment.', false, true);
    })
    .then(function () {
      if (btn) { btn.disabled = false; btn.textContent = formType === 'rsvp' ? 'Send RSVP' : 'Register Interest'; }
    });
  });

  function setStatus(msg, ok, warn) {
    var el = document.querySelector('.notice');
    if (!el) return;
    el.textContent = msg;
    el.style.color = ok ? '#2e7d32' : (warn ? '#b71c1c' : '');
  }
})();
