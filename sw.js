// === Service Worker: Geistlicher StrandBegleiter ===
//
// Versionsnummer erhöhen (v1 -> v2 -> v3 ...), sobald sich Inhalte/Bilder
// ändern. Nur so merkt der Browser, dass er den Cache erneuern muss.
const CACHE_NAME = "strandbegleiter-v2";

// Alle Dateien, die für die Offline-Nutzung vorab gespeichert werden sollen.
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./glaubetogo.html",
  "./kontakt.html",
   "./pfeife.html",
   "./platzhalter.html,
      
      
  "./sonntage/neujahr.html,
  "./sonntage/fluegel.png,
  "./sonntage/neujahr.jpg",

  "./toback.jpg",
  "./Cover.jpg",
  "./dreikirchen.jpg",
  "./teaser.jpg",
  "./dreikirchen.png",
  "./siegel.png",
  "./thesenkreuz.svg",

  "./register.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512-maskable.png",
  "./icon-512.png"
];

// --- INSTALL: Alle Dateien einmalig in den Cache laden ---
// --- FETCH: Cache-First, mit Netzwerk-Fallback ---
self.addEventListener("fetch", (event) => {
  // Nur GET-Anfragen behandeln
  if (event.request.method !== "GET") return;

  // WICHTIG: Nur http und https Anfragen verarbeiten (ignoriert chrome-extension:// etc.)
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Aus dem Cache (funktioniert offline)
      }

      // Nicht im Cache -> aus dem Netz laden und für später mit-cachen
      return fetch(event.request)
        .then((networkResponse) => {
          // Nur erfolgreiche Standard-Antworten (Status 200, Typ 'basic') cachen.
          // 'basic' bedeutet: Ressourcen kommen von deiner eigenen Domain.
          // 'cors' erlaubt auch Google Fonts, falls sie korrekt übertragen wurden.
          if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Kein Netz und nicht im Cache -> Fallback bei Seitennavigation
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});