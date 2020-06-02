import React from 'react'

export const FirebaseContext = React.createContext<firebase.app.App|null>(null)

interface FirebaseProviderProps {
  app: firebase.app.App
  children: React.ReactNode | React.ReactNode[]
}

export default function FirebaseProvider ({ children, app }: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={app}>
      {children}
    </FirebaseContext.Provider>
  )
}
