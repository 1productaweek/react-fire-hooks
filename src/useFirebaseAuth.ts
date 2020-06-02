import { useEffect, useState } from 'react'
import useFirebase from './useFirebase'
import 'firebase/app'

export async function waitForAuth (auth: firebase.auth.Auth) {
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

export default function useFirebaseAuth (): [firebase.User | null, boolean] {
  const [state, setState] = useState<[firebase.User | null, boolean]>([null, true])
  const firebase = useFirebase()

  useEffect(() => {
    if (!firebase) return

    return firebase.auth().onAuthStateChanged(async (user) => {
      setState([user, false])
    })
  }, [firebase])

  return state
}
