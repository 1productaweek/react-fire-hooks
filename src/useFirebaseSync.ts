import { useEffect, useState, useRef } from 'react'
import { TReference, TSnapshotHandler, TSnapshot, TStateResult } from './types'
import useFirebaseMemoRef from './useFirebaseMemoRef'

export interface FirebaseSyncOptions {
  handledError?: boolean
  includeMetadataChanges?: boolean
}

export default function useFirebaseSync<T extends TReference | null> (
  ref: T,
  options?: FirebaseSyncOptions|null,
): T extends firebase.firestore.DocumentReference ? TStateResult<firebase.firestore.DocumentSnapshot> : (T extends null ? TStateResult<null> : TStateResult<firebase.firestore.QuerySnapshot>) {
  const [state, setState] = useState<TStateResult<TSnapshot>>([null, null, true])
  const { handledError, includeMetadataChanges = true } = options || {}

  const memoRef = useFirebaseMemoRef(ref)

  useEffect(() => {
    if (!memoRef) {
      setState([null, null, false])
      return
    }
    setState((state) => [state[0], state[1], true])
    const unsub = (memoRef.onSnapshot as TSnapshotHandler)(
      { includeMetadataChanges },
      (doc: TSnapshot) => {
        setState([doc, null, false])
      },
      (err: firebase.FirebaseError) => {
        if (!handledError) {
          if (err && process.env.NODE_ENV !== 'production') {
            console.error(memoRef, err)
          }
        }
        setState((state) => [state[0], err, false])
      },
    )

    return unsub
  }, [memoRef, handledError, includeMetadataChanges])

  return state as any
}
