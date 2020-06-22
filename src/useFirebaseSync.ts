import { useEffect, useState, useRef } from 'react'
import { TReference, TSnapshotHandler, TSnapshot, TStateResult } from './types'
import useFirebaseMemoRef from './useFirebaseMemoRef'

export interface FirebaseSyncOptions {
  handledError?: boolean
  cacheTime?: number 
  includeMetadataChanges?: boolean
}

export default function useFirebaseSync<T extends TReference | null> (
  ref: T,
  options?: FirebaseSyncOptions|null,
): T extends firebase.firestore.DocumentReference ? TStateResult<firebase.firestore.DocumentSnapshot> : (T extends null ? TStateResult<null> : TStateResult<firebase.firestore.QuerySnapshot>) {
  const isExiting = useRef(false)
  const [state, setState] = useState<TStateResult<TSnapshot>>([null, null, true])
  const { handledError, cacheTime, includeMetadataChanges = true } = options || {}

  const memoRef = useFirebaseMemoRef(ref)

  useEffect(() => {
    if (!memoRef) {
      setState([null, null, false])
      return
    }
    const unsub = (memoRef.onSnapshot as TSnapshotHandler)(
      { includeMetadataChanges },
      (doc: TSnapshot) => {
        if (isExiting.current) return
        setState([doc, null, false])
      },
      (err: firebase.FirebaseError) => {
        if (isExiting.current) return
        if (!handledError) {
          if (err && process.env.NODE_ENV !== 'production') {
            console.error(memoRef, err)
          }
        }
        setState((state) => [state[0], err, false])
      },
    )

    return () => {
      isExiting.current = true

      // If cacheTime, keep the subscription around, so we continue
      // don't have to do a hard refresh next time
      setTimeout(unsub, cacheTime || 0)
    }
  }, [memoRef, handledError, cacheTime, includeMetadataChanges])

  return state as any
}
