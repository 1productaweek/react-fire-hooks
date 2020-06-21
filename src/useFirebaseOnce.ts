import { useEffect, useState } from 'react'
// import * as Sentry from '@sentry/browser'
import getRefUniq from './util/getRefUniq'
import { TReference, TSnapshot, TStateResult } from './types'

export default function useFirebaseOnce <T extends TReference | null> (
  ref: T,
  extra = [],
): T extends firebase.firestore.DocumentReference ? TStateResult<firebase.firestore.DocumentSnapshot> : (T extends null ? TStateResult<null> : TStateResult<firebase.firestore.QuerySnapshot>) {
  const [state, setState] = useState<TStateResult<TSnapshot>>([null, null, true])
  const id = getRefUniq(ref)
  useEffect(() => {
    (async () => {
      if (!id || !ref) {
        setState([null, null, false])
        return
      }
      if (state[2] !== true) setState([state[0], state[1], true])
      try {
        const result: TSnapshot = await ref.get()
        setState([result, null, false])
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(id, e)
        }
        // Sentry.configureScope(function (scope) {
        //   scope.setExtra('ref', id)
        //   Sentry.captureException(e)
        // })
        setState([state[0], e, false])
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ...extra])

  return state as any
}
