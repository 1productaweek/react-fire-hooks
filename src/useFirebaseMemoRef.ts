import { useEffect, useState, useRef } from 'react'
import { TReference } from './types'

export default function useFirebaseMemoRef <T extends TReference | null> (ref?: T) {
  const lastRef = useRef<any>(null)
  const [memoRef, setMemoRef] = useState<TReference|null>(null)

  useEffect(() => {
    const isEqual = lastRef.current && ref && ref.isEqual(lastRef.current)
    if (!ref || isEqual) return
    lastRef.current = ref
    setMemoRef(ref)
  }, [ref])

  return memoRef
}
