export type TReference = firebase.firestore.DocumentReference
  | firebase.firestore.CollectionReference
  | firebase.firestore.Query

export type TCollectionReference = firebase.firestore.CollectionReference
| firebase.firestore.Query

export type TSnapshot = firebase.firestore.DocumentSnapshot
  | firebase.firestore.QuerySnapshot

export type TSnapshotHandler = (
  options: firebase.firestore.SnapshotListenOptions,
  onNext: (snapshot: TSnapshot) => void,
  onError?: (error: firebase.FirebaseError) => void,
  onCompletion?: () => void
) => () => void

export type TStateResult<T> = [T | null, firebase.FirebaseError | null, boolean]

export interface SnapshotOptions {
  /**
   * If set, controls the return value for server timestamps that have not yet
   * been set to their final value.
   *
   * By specifying 'estimate', pending server timestamps return an estimate
   * based on the local clock. This estimate will differ from the final value
   * and cause these values to change once the server result becomes available.
   *
   * By specifying 'previous', pending timestamps will be ignored and return
   * their previous value instead.
   *
   * If omitted or set to 'none', `null` will be returned by default until the
   * server value becomes available.
   */
  readonly serverTimestamps?: 'estimate' | 'previous' | 'none';
}

export interface DocumentSnapshot<T> extends firebase.firestore.DocumentSnapshot {
  data(options?: SnapshotOptions): T | undefined;
}

export interface QueryDocumentSnapshot<T> extends firebase.firestore.QueryDocumentSnapshot {
  data(options?: SnapshotOptions): T;
}

// export type TFirestoreDocumentSnapshot<T> = 