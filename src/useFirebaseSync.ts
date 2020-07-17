import { useEffect, useState } from 'react'
import { TReference, TSnapshotHandler, TSnapshot, TStateResult } from './types'
import useFirebaseMemoRef from './useFirebaseMemoRef'

export interface FirebaseSyncOptions {
  handledError?: boolean
  includeMetadataChanges?: boolean
}

export function useFirebaseSync<Y=any>(ref?: firebase.firestore.DocumentReference|null, options?: FirebaseSyncOptions | null): TStateResult<firebase.firestore.DocumentSnapshot<Y>>
export function useFirebaseSync<Y=any>(ref?: firebase.firestore.CollectionReference|firebase.firestore.Query|null, options?: FirebaseSyncOptions | null): TStateResult<firebase.firestore.QuerySnapshot<Y>>
export default function useFirebaseSync<Y=any> (
  ref?: TReference|null,
  options?: FirebaseSyncOptions|null,
): TStateResult<TSnapshot<Y>> {
  const [state, setState] = useState<TStateResult<TSnapshot<Y>>>([null, null, true])
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
  }, [memoRef, includeMetadataChanges, handledError])

  return state as any
}
