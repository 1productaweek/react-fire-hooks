import { useContext } from 'react'
import { FirebaseAuthContext } from './FirebaseProvider'

export default function useFirebase () {
  return useContext(FirebaseAuthContext)
}
