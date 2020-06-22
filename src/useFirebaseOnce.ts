import { useEffect, useState, useMemo } from 'react'
import { TReference, TSnapshot, TStateResult } from './types'

export default function useFirebaseOnce <T extends TReference | null> (
  ref: () => T,
  dependencies = [],
): T extends firebase.firestore.DocumentReference ? TStateResult<firebase.firestore.DocumentSnapshot> : (T extends null ? TStateResult<null> : TStateResult<firebase.firestore.QuerySnapshot>) {
  const [state, setState] = useState<TStateResult<TSnapshot>>([null, null, true])
  const memoRef = useMemo(ref, dependencies)

  useEffect(() => {
    (async () => {
      if (!memoRef) {
        setState([null, null, false])
        return
      }
      if (state[2] !== true) setState([state[0], state[1], true])
      try {
        const result: TSnapshot = await memoRef.get()
        setState([result, null, false])
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(e)
        }
        setState([state[0], e, false])
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoRef])

  return state as any
}
