import { useContext } from 'react'
import { FirebaseContext } from './FirebaseProvider'

export default function useFirebase () {
  const resp = useContext(FirebaseContext)
  if (!resp) throw new Error('<FirebaseProvider> must be a parent')
  return resp
}
