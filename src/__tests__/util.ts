export async function deleteCollection (colRef: firebase.firestore.CollectionReference) {
  const col = await colRef.get()
  const p = col.docs.map((doc) => {
    return doc.ref.delete()
  })
  return Promise.all(p)
}