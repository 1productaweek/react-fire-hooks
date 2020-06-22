import React, { useState, useEffect } from 'react'

export const FirebaseContext = React.createContext<firebase.app.App|null>(null)
export const FirebaseAuthContext = React.createContext<[firebase.User|null, boolean]>([null, true])

interface FirebaseProviderProps {
  app: firebase.app.App
  children: React.ReactNode | React.ReactNode[]
}

export default function FirebaseProvider ({ children, app }: FirebaseProviderProps) {
  const [state, setState] = useState<[firebase.User | null, boolean]>([null, true])
    
  useEffect(() => {
    return app.auth().onAuthStateChanged(async (user) => {
      setState([user, false])
    })
  }, [app.auth])
  
  return (
    <FirebaseContext.Provider value={app}>
      <FirebaseAuthContext.Provider value={state}>
        {children}
      </FirebaseAuthContext.Provider>
    </FirebaseContext.Provider>
  )
}
