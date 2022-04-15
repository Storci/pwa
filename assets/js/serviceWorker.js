// Listen for install event, set callback
self.addEventListener('install', function(event) {
    // Perform some task
    console.log('service worker installed')
});

self.addEventListener('activate', function(event) {
  // Perform some task
  console.log('service worker activated')
});
