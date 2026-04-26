// justinfowler.com — analytics + click tracking
// PostHog US Cloud · project: justinfowler.com (filtered via site property)
// Loaded on every page via <script src="/assets/analytics.js" defer></script>

(function () {
  // ─── PostHog bootstrap (official snippet) ─────────────────
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url loaded".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init('phc_CHPeioNrffCBjKAm95xXG3rgBMPKixB2eWGp2sm2zhb8', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: true,         // mask form inputs by default
      maskTextSelector: '[data-mask]'
    },
    disable_session_recording: false,
    loaded: function (ph) {
      // Tag every event with site identifier — lets a single PostHog project
      // filter cleanly between justinfowler.com and purplechipmonk.com.
      ph.register({
        site: 'justinfowler.com',
        site_version: 'v1.1',
        page_path: location.pathname
      });
    }
  });

  // ─── Helper: safely call posthog.capture ──────────────────
  function track(event, props) {
    if (window.posthog && typeof posthog.capture === 'function') {
      posthog.capture(event, Object.assign({}, props || {}, {
        page_path: location.pathname,
        page_title: document.title
      }));
    }
  }
  window.__track = track;  // exposed for other scripts (e.g. lightbox)

  // ─── Click tracking via event delegation ──────────────────
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button');
    if (!el) return;

    // Explicit data-ph-event wins
    var custom = el.getAttribute('data-ph-event');
    if (custom) {
      track(custom, parseProps(el));
      return;
    }

    // Email me — every [data-email] button
    if (el.hasAttribute('data-email')) {
      track('cta.email_clicked', {
        subject: el.getAttribute('data-subject') || null,
        location: nearestSection(el)
      });
      return;
    }

    // PDF download
    if (el.tagName === 'A' && /\.pdf(\?|$|#)/i.test(el.getAttribute('href') || '')) {
      track('cta.pdf_downloaded', {
        href: el.getAttribute('href'),
        label: (el.textContent || '').trim().slice(0, 80)
      });
      return;
    }

    // Outbound social
    var href = el.getAttribute('href') || '';
    if (/^https?:\/\/(www\.)?linkedin\.com/.test(href)) {
      track('cta.linkedin_clicked', { href: href, location: nearestSection(el) });
      return;
    }
    if (/^https?:\/\/(www\.)?github\.com/.test(href)) {
      track('cta.github_clicked', { href: href, location: nearestSection(el) });
      return;
    }
    if (/^https?:\/\/purplechipmonk\.com/.test(href)) {
      track('cta.pcm_clicked', { href: href, location: nearestSection(el) });
      return;
    }

    // Internal portfolio / resume nav
    if (href === '/portfolio.html' || href === '/portfolio.html#work') {
      track('cta.portfolio_viewed', { from: location.pathname });
      return;
    }
    if (href === '/resume.html') {
      track('cta.resume_viewed', { from: location.pathname });
      return;
    }
  }, { capture: true, passive: true });

  function parseProps(el) {
    var props = {};
    Array.prototype.forEach.call(el.attributes, function (attr) {
      if (attr.name.indexOf('data-ph-') === 0 && attr.name !== 'data-ph-event') {
        var key = attr.name.replace('data-ph-', '').replace(/-/g, '_');
        props[key] = attr.value;
      }
    });
    return props;
  }

  function nearestSection(el) {
    var s = el.closest('section[id], article[id]');
    return s ? (s.id || s.tagName.toLowerCase()) : null;
  }

  // ─── Section-view tracking via IntersectionObserver ───────
  if ('IntersectionObserver' in window) {
    var seen = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        if (!id || seen.has(id)) return;
        seen.add(id);
        track('section.viewed', {
          section_id: id,
          page_section_index: Array.from(document.querySelectorAll('section[id]')).indexOf(entry.target)
        });
      });
    }, { threshold: 0.55, rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { io.observe(s); });
  }

  // ─── Special event: 404 shown ─────────────────────────────
  if (/^\/404(\.html)?$/i.test(location.pathname) || document.title.toLowerCase().indexOf('404') !== -1) {
    track('404.shown', { referrer: document.referrer || null });
  }

  // ─── UTM normalization (already auto-captured but logged for clarity) ───
  var params = new URLSearchParams(location.search);
  var utms = {};
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','ref'].forEach(function (k) {
    if (params.has(k)) utms[k] = params.get(k);
  });
  if (Object.keys(utms).length) {
    posthog.register(utms);  // sticky for the session
  }
})();
