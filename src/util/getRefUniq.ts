export default function getRefUniq (ref: any | null, deep?: boolean): string|null {
  if (!ref) return null
  if (ref._query) return ref._query.memoizedCanonicalId || ref._query.canonicalId()
  if (ref.memoizedCanonicalId) return ref.memoizedCanonicalId
  if (ref.canonicalId) return ref.canonicalId()
  if (ref.path) return ref.path
  if (!deep) return null
  const keys = Object.keys(ref)
  for (let key = 0; key < keys.length; key++) {
    return getRefUniq(keys[key], false)
  }
  return null
}
