import { useContext } from 'react'
import { FirebaseContext } from './FirebaseProvider'

export default function useFirebase () {
  return useContext(FirebaseContext)
}
