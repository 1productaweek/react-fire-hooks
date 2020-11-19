import { useContext } from 'react'
import { FirestoreContext } from './FirebaseProvider'

export default function useFirebase () {
  const resp = useContext(FirestoreContext)
  if (!resp) throw new Error('<FirebaseProvider> must be a parent')
  return resp
}
