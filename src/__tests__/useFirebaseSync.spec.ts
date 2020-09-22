import { renderHook, act } from '@testing-library/react-hooks'
import firebase from './firebase'
import { deleteCollection } from './util'
import useFirebaseSync from '../useFirebaseSync'

const db = firebase.firestore()
const colRef = db.collection('useFirebaseSync')

describe('useFirebaseSync.spec', () => {
  beforeEach(async () => {
    await deleteCollection(colRef)
  })

  test('initial state', () => {
    const { result } = renderHook(() => useFirebaseSync(colRef))
    const [res, err, loading] = result.current
    expect(res).toBe(null)
    expect(err).toBe(null)
    expect(loading).toBe(true)
  })

  test('single doc ref', async () => {
    const doc1 = { name: 'Calum', age: 20 }
    await colRef.doc('doc1').set(doc1)
    const docRef = colRef.doc('doc1')
    const { result, waitForNextUpdate } = renderHook(() => useFirebaseSync(docRef))
    await waitForNextUpdate()
    const [res] = result.current
    expect(res.data()).toEqual(doc1)
  })

  test('single doc ref with delayed ref', async () => {
    const doc1 = { name: 'Calum', age: 20 }
    await colRef.doc('doc1').set(doc1)
    const { result, rerender, waitForNextUpdate } = renderHook((initialValue: null) => useFirebaseSync(initialValue), {
      initialProps: null,
    })
    rerender(colRef)
    await waitForNextUpdate()
    const [res] = result.current
    expect(res.data()).toEqual([
      doc1,
    ])
  })

  test('empty collection state', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFirebaseSync(colRef))
    await waitForNextUpdate()
    const [res] = result.current
    expect(res.docs).toEqual([])
  })

  test('collection with 2 docs', async () => {
    const doc1 = { name: 'Calum', age: 20 }
    const doc2 = { name: 'John', age: 21 }
    await colRef.doc('doc1').set(doc1)
    await colRef.doc('doc2').set(doc2)
    const { result, waitForNextUpdate } = renderHook(() => useFirebaseSync(colRef))
    await waitForNextUpdate()
    const [res] = result.current
    expect(res.docs.map((doc) => doc.data())).toEqual([
      doc1,
      doc2,
    ])
  })

  test('collection with query', async () => {
    const doc1 = { name: 'Calum', age: 20 }
    const doc2 = { name: 'John', age: 21 }
    await colRef.doc('doc1').set(doc1)
    await colRef.doc('doc2').set(doc2)
    const query = colRef.where('age', '>', 20)
    const { result, waitForNextUpdate } = renderHook(() => useFirebaseSync(query))
    await waitForNextUpdate()
    const [res] = result.current
    expect(res.docs.map((doc) => doc.data())).toEqual([
      doc2,
    ])
  })

  test('collection with delayed ref', async () => {
    const doc1 = { name: 'Calum', age: 20 }
    await colRef.doc('doc1').set(doc1)
    const { result, rerender, waitForNextUpdate } = renderHook((initialValue: null) => useFirebaseSync(initialValue), {
      initialProps: null,
    })
    rerender(colRef)
    await waitForNextUpdate()
    const [res] = result.current
    expect(res.docs.map((doc) => doc.data())).toEqual([
      doc1,
    ])
  })

  test('collection is not rerendered when ref is equivilent', async () => {
    const doc1 = { name: 'Calum', age: 20 }
    await colRef.doc('doc1').set(doc1)
    const { result, rerender, waitForNextUpdate } = renderHook((initialValue) => useFirebaseSync(initialValue), {
      initialProps: colRef,
    })
    await waitForNextUpdate()
    const prev = result.current
    rerender(db.collection('useFirebaseSync'))
    const [res] = result.current
    expect(result.current[0]).toBe(prev[0])
    expect(res.docs[0].data()).toEqual(doc1)
  })

  // test('collection removes item', async () => {
  //   const doc1 = { name: 'Calum', age: 20 }
  //   const doc2 = { name: 'John', age: 21 }
  //   await colRef.doc('doc1').set(doc1)
  //   await colRef.doc('doc2').set(doc2)
  //   const { result, waitForNextUpdate } = renderHook(() => useFirebaseSync(colRef))
  //   await waitForNextUpdate()
  //   await act(async () => {
  //     await colRef.doc('doc1').delete()
  //   })
  //   await waitForNextUpdate()
  //   const [res] = result.current
  //   expect(res.docs.map((doc) => doc.data())).toEqual([
  //     doc2,
  //   ])
  // })
})
