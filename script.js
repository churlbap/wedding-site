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
