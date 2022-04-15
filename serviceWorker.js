// Listen for install event, set callback
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('htmlpages').then(function(cache) {
      return cache.addAll(
        [
          './bootstrap_theme/bootstrap.min.css',
        ]
      );
    })
  );
});

self.addEventListener('activate', function(event) {
  // Perform some task
  console.log('service worker activated')
});

self.addEventListener('fetch', function (event) {
  if(event.request.method === "GET"){
    event.respondWith(
      caches.open('stylesheets').then(cache => {
        return cache.match(event.request).then(response => {
          var fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone())
            return networkResponse
          })
          return response || fetchPromise
        })
      })
    )
 }
})
