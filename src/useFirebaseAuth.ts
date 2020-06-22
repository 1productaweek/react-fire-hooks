import { useEffect, useState } from 'react'
import useFirebase from './useFirebase'
import 'firebase/app'

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
