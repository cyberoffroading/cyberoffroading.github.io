/* CyberOffroading — Google Analytics 4 (gtag.js)
 *
 * The ONE place the Measurement ID lives. Every public page loads this file
 * from <head> as `/js/analytics.js?v=N` — bump N whenever this file changes.
 *
 * - Skips localhost / 127.0.0.1 so local previews never pollute the property.
 * - GA4 "enhanced measurement" (on by default in the web data stream) already
 *   records outbound clicks (= affiliate clicks), scroll depth, and
 *   history-based page changes (= guides opened in the modal via pushState),
 *   so no custom events are needed for the basics.
 */
(function () {
  var MEASUREMENT_ID = 'G-PB7ZDBE1VK';

  var host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);
})();
