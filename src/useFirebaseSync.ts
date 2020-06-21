/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react'
import { TReference, TSnapshotHandler, TSnapshot, TStateResult } from './types'
import getRefUniq from './util/getRefUniq'

export interface FirebaseSyncOptions {
  handledError?: boolean
  cacheTime?: number 
  includeMetadataChanges?: boolean
}

export default function useFirebaseSync<T extends TReference | null> (
  ref: T,
  options?: FirebaseSyncOptions|null,
  dependencies?: any[],
): T extends firebase.firestore.DocumentReference ? TStateResult<firebase.firestore.DocumentSnapshot> : (T extends null ? TStateResult<null> : TStateResult<firebase.firestore.QuerySnapshot>) {
  const isExiting = useRef(false)
  const lastRef = useRef<any>(null)
  const [state, setState] = useState<TStateResult<TSnapshot>>([null, null, true])
  
  useEffect(() => {
    const isEqualToLastRef = lastRef.current && ref && ref?.isEqual(lastRef.current)
    lastRef.current = ref
    if (!ref || isEqualToLastRef) {
      if (state[2] === true) setState([state[0], state[1], false])
      return
    }
    const unsub = (ref.onSnapshot as TSnapshotHandler)(
      { includeMetadataChanges: options?.includeMetadataChanges === false ? false : true },
      (doc: TSnapshot) => {
        if (isExiting.current) return
        setState([doc, null, false])
      },
      (err: firebase.FirebaseError) => {
        if (isExiting.current) return
        if (!options?.handledError) {
          // Sentry.configureScope(function (scope) {
          //   scope.setExtra('ref', id)
          //   Sentry.captureException(err)
          // })
          if (err && process.env.NODE_ENV !== 'production') {
            console.error(getRefUniq(ref, true), err)
          }
        }
        setState([state[0], err, false])
      },
    )

    return () => {
      isExiting.current = true

      // If cacheTime, keep the subscription around, so we continue
      // don't have to do a hard refresh next time
      setTimeout(unsub, options?.cacheTime || 0)
    }
  }, [ref, ...(dependencies || [])])

  return state as any
}
