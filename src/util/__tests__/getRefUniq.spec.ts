import firebase from '../../__tests__/firebase'
import getRefUniq from '../getRefUniq'

const db = firebase.firestore()

describe('getRefUniq.spec', () => {
  test('ref for null', () => {
    expect(getRefUniq(null)).toEqual(null)
  })
  
  test('ref for collection', () => {
    expect(getRefUniq(db.collection('abc'))).toEqual('abc|f:|ob:__name__asc|lt:F')
  })

  test('ref for collection group', () => {
    expect(getRefUniq(db.collectionGroup('abc'))).toEqual('|cg:abc|f:|ob:__name__asc|lt:F')
  })

  test('ref for collection with filter', () => {
    expect(getRefUniq(db.collection('abc').where('field', '>', 'a'))).toEqual('abc|f:field>a|ob:fieldasc,__name__asc|lt:F')
  })

  test('ref for collection with multi-depth filter', () => {
    expect(getRefUniq(db.collection('abc').where('field.name', '>', ''))).toEqual('abc|f:field.name>|ob:field.nameasc,__name__asc|lt:F')
  })

  test('ref for doc', () => {
    expect(getRefUniq(db.collection('abc').doc('123'))).toEqual('abc/123')
  })
})