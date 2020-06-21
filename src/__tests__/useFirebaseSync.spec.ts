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
    const { result, rerender, waitForNextUpdate } = renderHook((initialValue) => useFirebaseSync(initialValue), {
      initialProps: null
    })
    rerender(colRef)
    await waitForNextUpdate()
    const [res] = result.current
    expect((res as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>).docs.map((doc) => doc.data())).toEqual([
      doc1,
    ])
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