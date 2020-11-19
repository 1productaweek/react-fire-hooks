import React from 'react'

export const FirebaseContext = React.createContext<firebase.app.App|null>(null)
export const FirestoreContext = React.createContext<firebase.firestore.Firestore|null>(null)

interface FirebaseProviderProps {
  app: firebase.app.App
  firestore?: firebase.firestore.Firestore
  children: React.ReactNode | React.ReactNode[]
}

export default function FirebaseProvider ({ children, app, firestore }: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={app}>
      <FirestoreContext.Provider value={firestore || app.firestore()}>
        {children}
      </FirestoreContext.Provider>
    </FirebaseContext.Provider>
  )
}
