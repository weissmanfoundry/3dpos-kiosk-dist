// ==UserScript==
// @name         3DPrinterOS Kiosk UI
// @namespace    https://cloud.3dprinteros.com/
// @version      0.2.0
// @description  Locked-down kiosk UI for Printers + Live Wall with hidden OFF hotkey and rerender resilience
// @match        https://cloud.3dprinteros.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==


(() => {
  'use strict';

const BASELINE_CSS = String.raw`/* --- FOUNDATION --- */

/* Kill the forced desktop layout */
html,
body {
	width: 100% !important;
	min-width: 0 !important;
	max-width: 100% !important;
	overflow-x: hidden !important;
}

/* Page container */
.container-custom {
	margin-top: 12px !important; /* was 40px */
	padding: 12px !important;
	max-width: 100% !important;
}


/* --- PAGE-LEVEL ELEMENTS --- */
/* This file contains all page-level styling and hiding rules */

/* ========================================
   HIDING ELEMENTS
   ======================================== */

/* Remove header + footer + chat */
#nav,
.footer--global,
section.chat[data-v-2bf39e6a] {
	display: none !important;
}

/* Hide "Schedule View" tab in page top bar */
.top-bar--left > button:nth-of-type(2) {
	display: none;
}

/* Hide search + add printer + filter + kebab in page top bar (but keep layout toggles + Live View Wall) */
.top-bar--right > button,
.top-bar--right > div:not(:first-child),
.top-bar--right .search-wrapper {
	display: none !important;
}

/* ========================================
   PAGE TOP BAR STYLING
   ======================================== */

/* Top bar spacing */
.top-bar {
	margin-bottom: 12px !important;
}

/* Top bar right side layout */
.top-bar--right {
	display: flex !important;
	align-items: center !important;
	gap: 8px !important;
}

/* Top bar buttons - touch-friendly sizing */
.top-bar--left > button,
.top-bar--right > button {
	min-height: 44px !important;
	padding: 10px 16px !important;
	touch-action: manipulation !important; /* Disable double-tap zoom on buttons */
}

/* Increase spacing between interactive elements in top bar */
.top-bar--right {
	gap: 12px !important; /* Increased from 8px */
}


/* --- PRINTERS GRID VIEW --- */
/* Styling for grid view of printer cards */

/* Grid layout */
.printer-list-type-grid,
.printers-table__grid {
	display: grid !important;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important;
	gap: 12px !important;
	align-items: start !important;
}

/* Each printer "card" wrapper (help the grid items behave) */
.partial-renderer-item,
.printers-table__item {
	width: auto !important;
	min-width: 0 !important;
}

/* Remove table-y width assumptions */
.table--files.table--jobs.only-printers {
	width: 100% !important;
}

/* Card typography */
.printers-page {
	font-size: 16px !important;
	line-height: 1.2 !important;
}

.printer-details-title {
	font-size: 18px !important;
	font-weight: 700 !important;
}

.printer-details-type {
	font-size: 14px !important;
	opacity: 0.85 !important;
}

.printer-temperatures-grid .text--500 {
	font-size: 15px !important;
	font-weight: 600 !important;
}

/* "Build Tray is clear" toggle row spacing */
.build-tray-clear-button {
	font-size: 14px !important;
}

/* Card padding */
.printers-table__item .border-separator,
.printers-table__item .p-2,
.printers-table__item .p-2-5 {
	padding: 10px !important;
}


/* --- PRINTERS LIST VIEW --- */
/* Styling for list view of printer cards, including top bar within cards and job queue */

/* --- LIST MODE ONLY: apply only when NOT inside .printer-list-type-grid --- */

/* shorthand selector we'll reuse */
.printers-table__item:not(.printer-list-type-grid .printers-table__item) .top-bar {
	display: grid !important;
	grid-template-columns: 1fr max-content;
	grid-template-rows: auto auto;
	column-gap: 12px;
	row-gap: 2px;
	align-items: center;
}

/* keep left + mid placement */
.printers-table__item:not(.printer-list-type-grid .printers-table__item) .top-bar--left {
	grid-column: 1;
	grid-row: 1;
}
.printers-table__item:not(.printer-list-type-grid .printers-table__item) .top-bar--mid {
	grid-column: 1;
	grid-row: 2;
	justify-self: start;
}

/* move build tray toggle to top-right (stay inside card) */
.printers-table__item:not(.printer-list-type-grid .printers-table__item) .top-bar--right {
	grid-column: 2;
	grid-row: 1;
	justify-self: end;
	align-self: center;
	margin: 0 !important;

	display: inline-flex !important;
	align-items: center !important;
	gap: 8px !important;
	white-space: nowrap !important;
}

/* keep label on one line */
.printers-table__item:not(.printer-list-type-grid .printers-table__item)
	.top-bar--right
	.build-tray-clear-button
	.custom-control-label {
	white-space: nowrap !important;
}

/* filament + temps: single row, no <p> margins */
.printers-table__item:not(.printer-list-type-grid .printers-table__item) .top-bar--mid {
	display: flex !important;
	align-items: center !important;
	gap: 24px !important;
	flex-wrap: nowrap !important;
}

.printers-table__item:not(.printer-list-type-grid .printers-table__item) .top-bar--mid p {
	margin: 0 !important;
}

/* list mode only: hide other right-side controls */
.printers-table__item:not(.printer-list-type-grid .printers-table__item)
	.top-bar--right
	> :not(.build-tray-clear-button) {
	display: none !important;
}

/* ------- Printing/Queue List ------- */

/* Keep the "job in progress" area inside the card */
.printers-table__item .printers-table__item__queue,
.printers-table__item .collapse-jobs--in-progress {
	max-width: 100% !important;
	overflow: hidden !important;
}

/* The jobs table itself should not exceed the card */
.printers-table__item .jobs-table {
	width: 100% !important;
	max-width: 100% !important;
}

.table--files tr,
.table--projects tr {
	flex-wrap: wrap !important;
	height: auto !important;
	max-width: 100% !important;
}

.table--files th,
.table--files td,
.table--projects th,
.table--projects td {
	min-width: 0 !important;
}

/* ------ formatting print list ----- */

/* --- JOB ROW LAYOUT: FORCE 3 LINES (grid) --- */
.jobs-table tbody tr[role='row'] {
	display: grid !important;
	grid-template-columns: auto 1fr auto auto; /* img | main | middle | right */
	grid-template-rows: auto auto auto; /* line 1 | line 2 | line 3 */
	column-gap: 16px !important;
	row-gap: 10px !important;
	align-items: center !important;
	height: auto !important;
	max-width: 100% !important;
}

.jobs-table tbody tr[role='row'] > td {
	min-width: 0 !important;
	max-width: 100% !important;
}

/* Hide sort column */
.jobs-table tbody tr[role='row'] > td[aria-colindex='1'] {
	display: none !important;
}

/* LINE 1: image+name (2+3) + date/author (5) */
.jobs-table tbody tr[role='row'] > td[aria-colindex='2'] {
	grid-column: 1;
	grid-row: 1;
}
.jobs-table tbody tr[role='row'] > td[aria-colindex='3'] {
	grid-column: 2;
	grid-row: 1;
}
.jobs-table tbody tr[role='row'] > td[aria-colindex='5'] {
	grid-column: 4;
	grid-row: 1;
	justify-self: end !important;
	white-space: nowrap !important;
}

/* LINE 2: time left (4) + cost (6) + filament right (7) */
.jobs-table tbody tr[role='row'] > td[aria-colindex='4'] {
	grid-column: 2;
	grid-row: 2;
	justify-self: start !important;
	white-space: nowrap !important;
}
.jobs-table tbody tr[role='row'] > td[aria-colindex='6'] {
	grid-column: 3;
	grid-row: 2;
	justify-self: center !important;
	white-space: nowrap !important;
}
.jobs-table tbody tr[role='row'] > td[aria-colindex='7'] {
	grid-column: 4;
	grid-row: 2;
	justify-self: end !important;
	white-space: nowrap !important;
}

/* LINE 3: buttons/actions (8) */
.jobs-table tbody tr[role='row'] > td[aria-colindex='8'] {
	grid-column: 2 / 5; /* span columns 2-4 */
	grid-row: 3;
	justify-self: end !important;
}

.jobs-table tbody tr[role='row'] > td[aria-colindex='8'] > div {
	display: flex !important;
	justify-content: flex-end !important;
	align-items: center !important;
	gap: 10px !important;
	flex-wrap: wrap !important; /* allow buttons to wrap if needed */
}

/* Touch targets for list view job queue buttons */
.printers-table__item .jobs-table button,
.printers-table__item .jobs-table [role='button'],
.printers-table__item .jobs-table a[role='button'] {
	min-height: 44px !important;
	min-width: 44px !important;
	padding: 8px 12px !important;
	touch-action: manipulation !important;
}

.jobs-table tbody tr[role='row'] > td[aria-colindex='8'] > div {
	gap: 12px !important; /* Increased from 10px */
}

/* Add padding to last row in list view job queue */
//.printers-table__item:not(.printer-list-type-grid .printers-table__item) .jobs-table tbody tr[role='row']:last-child {
.jobs-table tbody tr[role='row']:last-child {
	padding-bottom: 12px !important; // I don't undersand why this isn't showing
}


/* --- RESPONSIVE BREAKPOINTS --- */
/* Media queries for different screen sizes */

/* Small screens */
@media (max-width: 900px) {
	.container-custom {
		padding: 10px !important;
	}

	/* Grid view adjustments for small screens */
	.printer-list-type-grid {
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
		gap: 10px !important;
	}

	/* List view maintains spacing on small screens */
	.printers-table__grid:not(.printer-list-type-grid) {
		gap: 12px !important; /* Maintain original spacing */
	}

	.printer-details-title {
		font-size: 17px !important;
	}
	.printers-page {
		font-size: 15px !important;
	}
}

@media (max-width: 600px) {
	/* Force single column when it gets tight (grid view only) */
	.printer-list-type-grid {
		grid-template-columns: 1fr !important;
	}

	/* List view maintains spacing on very small screens */
	.printers-table__grid:not(.printer-list-type-grid) {
		gap: 12px !important; /* Maintain original spacing */
	}

	.printer-details-title {
		font-size: 18px !important;
	}
	.printers-page {
		font-size: 16px !important;
	}
}

/* Large screens (Desktop PWA) */
@media (min-width: 1200px) {
	/* Allow more columns on large screens for better space utilization (grid view only) */
	.printer-list-type-grid {
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
		gap: 16px !important;
	}

	/* Keep list view spacing the same on large screens */
	.printers-table__grid:not(.printer-list-type-grid) {
		gap: 12px !important; /* Maintain original spacing */
	}

	/* Slightly larger text on big screens for better readability */
	.printers-page {
		font-size: 17px !important;
	}

	.printer-details-title {
		font-size: 19px !important;
	}

	/* More comfortable padding on large screens */
	.container-custom {
		padding: 16px !important;
		max-width: 1600px !important; /* Prevent excessive width on very large screens */
		margin-left: auto !important;
		margin-right: auto !important;
	}
}

@media (min-width: 1600px) {
	/* Very large screens - optimize for wide displays (grid view only) */
	.printer-list-type-grid {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
		gap: 20px !important;
	}

	/* Keep list view spacing the same on very large screens */
	.printers-table__grid:not(.printer-list-type-grid) {
		gap: 12px !important; /* Maintain original spacing */
	}

	.container-custom {
		padding: 20px !important;
	}
}


`;

/*****************************************************************
 * CONFIG
 *****************************************************************/
const CONFIG = {
  routes: {
    printers: '#/printers',
    liveWall: '#/live-wall',
    // login / landing: "#/" (forced OFF for recovery)
  },

  // Secret OFF/ON hotkey (hard to hit accidentally)
  // Ctrl + Alt + Shift + O
  hotkey: { key: 'O', ctrl: true, alt: true, shift: true, meta: false },

  // Per-device persistence
  enabledByDefault: true,
  debugByDefault: false,

  // Root scoping: ALL kiosk CSS requires this class
  rootOnClass: 'tm-kiosk-on',

  // Injected style tag id
  styleId: 'tm-kiosk-style',

  // Storage keys (per kiosk browser profile)
  storage: {
    enabled: 'tm3dp_kiosk_enabled',
    debug: 'tm3dp_kiosk_debug',
  },

  // Safety: if logged out, we must be able to log in.
  // So: never apply kiosk CSS on login route.
  forceOffOnLoginRoute: true,

  // Lockdown behavior: keep the user on allowed routes only
  lockdown: {
    // If a user somehow lands elsewhere, force redirect back to printers.
    redirectUnknownRoutesToPrinters: true,

    // Prevent obvious navigation attempts (still not a security boundary, but reduces accidents)
    blockNewWindow: true,
    blockExternalLinks: true,
  }
};


/*****************************************************************
 * STATE
 *****************************************************************/
// Fallback in-memory storage if localStorage is unavailable
const memoryStorage = {};

function safeGetItem(key, defaultValue) {
	try {
		const raw = localStorage.getItem(key);
		return raw === null ? defaultValue : raw;
	} catch (e) {
		// localStorage unavailable (private mode, CSP, etc.) - use memory fallback
		log('localStorage unavailable, using memory fallback:', e.message);
		return memoryStorage[key] !== undefined ? memoryStorage[key] : defaultValue;
	}
}

function safeSetItem(key, value) {
	try {
		localStorage.setItem(key, value);
		// Also update memory fallback
		memoryStorage[key] = value;
	} catch (e) {
		// localStorage unavailable - use memory fallback only
		log('localStorage unavailable, using memory fallback:', e.message);
		memoryStorage[key] = value;
	}
}

const State = {
	get enabled() {
		const raw = safeGetItem(CONFIG.storage.enabled, null);
		if (raw === null) return CONFIG.enabledByDefault;
		return raw === '1';
	},
	set enabled(v) {
		safeSetItem(CONFIG.storage.enabled, v ? '1' : '0');
	},
	get debug() {
		const raw = safeGetItem(CONFIG.storage.debug, null);
		if (raw === null) return CONFIG.debugByDefault;
		return raw === '1';
	},
	set debug(v) {
		safeSetItem(CONFIG.storage.debug, v ? '1' : '0');
	},
};

function log(...args) {
	if (State.debug) console.log('[tm-kiosk]', ...args);
}


/*****************************************************************
 * ROUTES
 *****************************************************************/
function hash() {
	return window.location.hash || '';
}

function isLoginRoute(h) {
	return h === '#/' || h === '#' || h === '';
}

function isAllowedRoute(h) {
	return h.startsWith(CONFIG.routes.printers) || h.startsWith(CONFIG.routes.liveWall);
}

// Intercept pushState/replaceState to catch programmatic route changes
function interceptHistoryAPI() {
	if (window.__tmHistoryIntercepted) return;
	window.__tmHistoryIntercepted = true;

	const originalPushState = history.pushState;
	const originalReplaceState = history.replaceState;

	history.pushState = function (...args) {
		originalPushState.apply(history, args);
		// Small delay to let the route change settle
		setTimeout(() => scheduleApply('pushState'), 0);
	};

	history.replaceState = function (...args) {
		originalReplaceState.apply(history, args);
		// Small delay to let the route change settle
		setTimeout(() => scheduleApply('replaceState'), 0);
	};

	log('History API interception installed');
}


/*****************************************************************
 * STYLE / ENABLE
 *****************************************************************/
function setRootEnabled(on) {
	try {
		document.documentElement.classList.toggle(CONFIG.rootOnClass, !!on);
	} catch (e) {
		log('Error toggling root class:', e.message);
	}
}

function ensureStyleTag(enabled) {
	try {
		let style = document.getElementById(CONFIG.styleId);

		if (!enabled) {
			if (style) {
				try {
					style.remove();
				} catch (e) {
					log('Error removing style tag:', e.message);
				}
			}
			return;
		}

		if (!style) {
			try {
				style = document.createElement('style');
				style.id = CONFIG.styleId;
				style.type = 'text/css';
				if (!document.head) {
					log('Error: document.head not available');
					return;
				}
				document.head.appendChild(style);
			} catch (e) {
				log('Error creating style tag:', e.message);
				return;
			}
		}

		if (style.textContent !== BASELINE_CSS) {
			try {
				style.textContent = BASELINE_CSS;
			} catch (e) {
				log('Error setting style content:', e.message);
			}
		}
	} catch (e) {
		log('Error in ensureStyleTag:', e.message);
	}
}


/*****************************************************************
 * LOCKDOWN HELPERS (best-effort, not a security boundary)
 *****************************************************************/
let anchorBlockHandler = null;

function applyLockdown(h) {
	if (!CONFIG.lockdown.blockNewWindow) return;

	// Block window.open usage from clicks (best-effort)
	// (We keep original around for your OFF mode.)
	if (!window.__tmOrigOpen) {
		window.__tmOrigOpen = window.open;
		window.open = function () {
			log('Blocked window.open');
			return null;
		};
	}

	if (CONFIG.lockdown.blockExternalLinks) {
		// Disable anchor navigation attempts within allowed routes (best-effort).
		// We do this by capturing click events on <a>.
		if (!window.__tmAnchorBlockInstalled) {
			window.__tmAnchorBlockInstalled = true;
			anchorBlockHandler = (e) => {
				if (!State.enabled) return; // only block when kiosk is ON
				const a = e.target && e.target.closest ? e.target.closest('a') : null;
				if (!a) return;

				const href = a.getAttribute('href') || '';
				// Allow internal hash navigation between allowed routes
				if (href.startsWith('#/printers') || href.startsWith('#/live-wall')) return;

				// Otherwise block
				e.preventDefault();
				e.stopPropagation();
				log('Blocked link click:', href);
			};
			document.addEventListener('click', anchorBlockHandler, true);
		}
	}

	// If someone lands on a disallowed route, push them back.
	if (CONFIG.lockdown.redirectUnknownRoutesToPrinters) {
		if (!isLoginRoute(h) && !isAllowedRoute(h)) {
			log('Redirecting unknown route -> printers:', h);
			window.location.hash = CONFIG.routes.printers;
		}
	}
}

function removeLockdown() {
	// Restore window.open if we blocked it
	if (window.__tmOrigOpen) {
		window.open = window.__tmOrigOpen;
		window.__tmOrigOpen = null;
	}

	// Remove anchor click blocker if installed
	if (window.__tmAnchorBlockInstalled && anchorBlockHandler) {
		document.removeEventListener('click', anchorBlockHandler, true);
		window.__tmAnchorBlockInstalled = false;
		anchorBlockHandler = null;
	}
}


/*****************************************************************
 * HIDDEN HOTKEY TOGGLE
 *****************************************************************/
function hotkeyMatches(e) {
	const hk = CONFIG.hotkey;
	if ((e.key || '').toUpperCase() !== (hk.key || '').toUpperCase()) return false;
	if (e.ctrlKey !== !!hk.ctrl) return false;
	if (e.altKey !== !!hk.alt) return false;
	if (e.shiftKey !== !!hk.shift) return false;
	if (e.metaKey !== !!hk.meta) return false;

	// Don't toggle while typing
	const t = e.target;
	const tag = t && t.tagName ? t.tagName.toLowerCase() : '';
	const typing = tag === 'input' || tag === 'textarea' || t?.isContentEditable;
	if (typing) return false;

	return true;
}

function installHotkey() {
	function handleKeydown(e) {
		if (!hotkeyMatches(e)) return;
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();

		State.enabled = !State.enabled;
		apply('hotkey');
		log('Hotkey triggered, enabled:', State.enabled);
	}

	// Attach to both window and document to ensure we catch it
	window.addEventListener('keydown', handleKeydown, true);
	document.addEventListener('keydown', handleKeydown, true);

	log('Hotkey installed: Ctrl+Alt+Shift+O');
}


/*****************************************************************
 * OBSERVERS
 *****************************************************************/
let mutationObserver = null;

function installObservers() {
	// Listen for hash changes
	window.addEventListener('hashchange', () => scheduleApply('hashchange'));

	// Listen for popstate (back/forward button, pushState/replaceState)
	window.addEventListener('popstate', () => scheduleApply('popstate'));

	// MutationObserver: Try to scope to main container for better performance
	// If container doesn't exist yet, observe body and re-scope when container appears
	function setupMutationObserver() {
		if (mutationObserver) {
			mutationObserver.disconnect();
		}

		// Try to find the main content container
		const container = document.querySelector('.container-custom') || document.querySelector('main') || document.body;

		mutationObserver = new MutationObserver(() => scheduleApply('mutation'));

		// Use more specific options - only watch for structural changes
		// attributes: false - don't watch attribute changes (too noisy)
		// characterData: false - don't watch text changes (too noisy)
		// childList: true - watch for element additions/removals
		// subtree: true - but scoped to container, not entire document
		mutationObserver.observe(container, {
			childList: true,
			subtree: true,
			attributes: false,
			characterData: false,
		});

		log('MutationObserver scoped to:', container.className || container.tagName);
	}

	// Initial setup
	setupMutationObserver();

	// If container doesn't exist yet, watch for it to appear
	if (!document.querySelector('.container-custom')) {
		const checkForContainer = setInterval(() => {
			if (document.querySelector('.container-custom')) {
				clearInterval(checkForContainer);
				setupMutationObserver();
			}
		}, 500);

		// Stop checking after 10 seconds
		setTimeout(() => clearInterval(checkForContainer), 10000);
	}
}


/*****************************************************************
 * APPLY LOOP (idempotent + rerender resilient)
 *****************************************************************/
let applyTimer = null;
function scheduleApply(reason) {
	if (applyTimer) clearTimeout(applyTimer);
	applyTimer = setTimeout(() => {
		applyTimer = null;
		apply(reason);
	}, 50);
}

function apply(reason) {
	const h = hash();

	// Only operate on allowed routes and login route.
	// Everything else: if enabled, redirect back to printers; if disabled, do nothing.
	if (!isAllowedRoute(h) && !isLoginRoute(h)) {
		if (State.enabled && CONFIG.lockdown.redirectUnknownRoutesToPrinters) {
			window.location.hash = CONFIG.routes.printers;
		} else {
			setRootEnabled(false);
			ensureStyleTag(false);
		}
		return;
	}

	// Login route forced OFF (recovery)
	if (CONFIG.forceOffOnLoginRoute && isLoginRoute(h)) {
		setRootEnabled(false);
		ensureStyleTag(false);
		log(`apply(${reason}): login route => forced OFF`);
		return;
	}

	const on = State.enabled;

	// Apply or remove lockdown behaviors based on state
	if (on) {
		applyLockdown(h);
	} else {
		removeLockdown();
	}

	// Note: CSS and lockdown apply to both #/printers and #/live-wall routes
	// The CSS is scoped to general selectors (.container-custom, etc.) that work on both routes
	setRootEnabled(on);
	ensureStyleTag(on);
	log(`apply(${reason}): ${h} enabled=${on}`);
}


/*****************************************************************
 * INIT
 *****************************************************************/
installHotkey();
installObservers();
interceptHistoryAPI();
apply('init');


})();
