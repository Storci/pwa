importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js")
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

/*var firebaseConfig = {
   
};*/
firebase.initializeApp({
  messagingSenderId: "1040048598489",
  apiKey: "AIzaSyB6L_2pDhDz1RXHA5ZA8g9hsU9e4EOHGvU",
  authDomain: "storci-thingworx-ui.firebaseapp.com",
  projectId: "storci-thingworx-ui",
  storageBucket: "storci-thingworx-ui.appspot.com",
  messagingSenderId: "1040048598489",
  appId: "1:1040048598489:web:81d20e1907671b25aabdc8",
  measurementId: "G-8KW275718B"
});

const messaging= firebase.messaging()


  
/*messaging.setBackgroundMessageHandler(payload => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload.notification.body
  );
  // Customize notification here
  const notification = JSON.parse(payload.data.notification);
  const notificationTitle = notification.title;
  const notificationOptions = {
    body: notification.body
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});*/
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});