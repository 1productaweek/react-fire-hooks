export default async function getFirebaseAuth (auth: firebase.auth.Auth) {
  let removeWatch = () => {}
  const promise: firebase.User = await new Promise((resolve) => {
    removeWatch = auth.onAuthStateChanged((auth) => {
      if (auth) {
        resolve(auth)
      }
    })
  })
  if (removeWatch) removeWatch()
  return promise
}