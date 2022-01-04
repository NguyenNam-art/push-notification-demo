const publicVapidKey = "BNBCKS5eEzcag1Gh1QT_vvTHmDhwOBLzqmC4jCLHjnMorN4NurRPZnhLs5Vm96-IGhPcO8cnD8VxAMZWqEZlSXM"

// Check for service worker
if ("serviceWorker" in navigator) {
  send().catch(err => console.error(err));
}

// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/"
  });
  console.log("Service Worker Registered...");

  // Register Push
  console.log("Registering Push...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicVapidKey
  });
  console.log("Push Registered...");
}

function sendSubscription(subscription) {
  return fetch(`http://localhost:5000/subscribe`, {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

async function subscribeUser() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function(registration) {
      if (!registration.pushManager) {
        console.log('Push manager unavailable.')
        return
      }
      registration.pushManager.getSubscription().then(function(existedSubscription) {
        if (existedSubscription === null) {
          console.log('No subscription detected, make a request.')
          registration.pushManager.subscribe({
            applicationServerKey: publicVapidKey,
            userVisibleOnly: true,
          }).then(function(newSubscription) {
            console.log('New subscription added.')
            console.log( JSON.stringify(newSubscription))
            sendSubscription(newSubscription)
          }).catch(function(e) {
            if (Notification.permission !== 'granted') {
              console.log('Permission was not granted.')
            } else {
              console.error('An error ocurred during the subscription process.', e)
            }
          })
        } else {
          console.log('Existed subscription detected.')
          sendSubscription(existedSubscription)
        }
      })
    })
      .catch(function(e) {
        console.error('An error ocurred during Service Worker registration.', e)
      })
  }
}
