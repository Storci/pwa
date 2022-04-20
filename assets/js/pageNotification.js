const firebaseConfig = {
  apiKey: "AIzaSyB6L_2pDhDz1RXHA5ZA8g9hsU9e4EOHGvU",
  authDomain: "storci-thingworx-ui.firebaseapp.com",
  projectId: "storci-thingworx-ui",
  storageBucket: "storci-thingworx-ui.appspot.com",
  messagingSenderId: "1040048598489",
  appId: "1:1040048598489:web:81d20e1907671b25aabdc8",
  measurementId: "G-8KW275718B"
};



// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
// dichirazione delle funzione di firebase
const messaging = firebase.messaging();
const db = firebase.database();
const user= firebase.auth()
//
const pushBtn = document.getElementById('btn-notify')


// Initialize Firebase Cloud Messaging and get a reference to the service

//pushBtn.addEventListener('click', () =>{
  messaging.requestPermission().then(function() {
    console.log("permission granted")
    return messaging.getToken();
  })
  .then(function(token) {
    console.log(token);

  })
  .catch(function(err) {
    console.log("No permission to send push.");

  });


  messaging.onMessage(function(payload){
    console.log('onMessage: ', payload)
  })

//})














/*


"use strict";

const pushBtn = document.getElementById('btn-notify')
console.log(pushBtn)

let swRegistration =null;
initializeApp();

function initializeApp() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    //Register the service worker
    navigator.serviceWorker
      .register('./sw.js')
      .then(swReg => {
        console.log('Service Worker is registered', swReg);
        // We are storing the service worker, globally
        swRegistration = swReg;
        initializeUi();
      })
      .catch(error => {
        console.error('Service Worker Error', error);
      });
  } else {
    console.warn('Push messaging is not supported');
    pushBtn.textContent = 'Push Not Supported';
  }
}

function initializeUi() {
  pushBtn.addEventListener('click', ()=> {
    displayNotification();
  });
}

function displayNotification() {
  //Ask user if we show notifications
  if (window.Notification && Notification.permission === 'granted') {
    notification();
    // We will create this function in a further step.
  }
  // If the user hasn't told whether he wants to be notified or not
  // Note: because of Chrome, we cannot be sure the permission property
  // is set, therefore it's unsafe to check for the "default" value.
  else if (window.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(status => {
      if (status === 'granted') {
        notification();
      } else {
        alert('You denied or dismissed permissions to notifications.');
      }
    });
  } else {
    // If the user refuses to get notified
    alert(
      'You denied permissions to notifications. Please go to your browser or phone setting to allow notifications.'
    );
  }
}
 function notification(){
  const options ={
    body: 'Storci Push Notification',
    icon: './Firebase/js/assets/img/Storci_Logo_191x73_1_.svg'
  }
  swRegistration.showNotification("PWA Notification!", options);
 }


*/
