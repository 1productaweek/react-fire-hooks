import find from 'lodash/find'

type TDocRefence = firebase.firestore.DocumentData

export default function getRefUniq (ref: TDocRefence | null): string|null {
  if (!ref) return null
  if (ref._query) return ref._query.memoizedCanonicalId || ref._query.canonicalId()
  if (ref.memoizedCanonicalId) return ref.memoizedCanonicalId
  if (ref.canonicalId) return ref.canonicalId()
  if (ref.path) return ref.path
  return find(ref, (sub) => getRefUniq(sub))
}
