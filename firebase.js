import { initializeApp } from 'firebase/app';
import { collection, getFirestore, getDocs, setDoc, doc , deleteDoc } from 'firebase/firestore/lite';
import { ref, onUnmounted } from 'vue'

const config = 
    {

        apiKey: "AIzaSyCHWIWE0pPP9IdVuRCe7Bv6zLy90mB44v0",
      
        authDomain: "diary-app-3f670.firebaseapp.com",
      
        projectId: "diary-app-3f670",
      
        storageBucket: "diary-app-3f670.appspot.com",
      
        messagingSenderId: "864606302121",
      
        appId: "1:864606302121:web:d1ba23f79396f051da9eb8"
      
      }

      const firebaseApp = initializeApp(config);

      const db = getFirestore(firebaseApp);
      const entriesCollection = collection(db, 'entries')

      export const getEntry = async id => {
        const doc = await entriesCollection.doc(id).get()
        return doc.data()
      }

      export const createEntry = (entry, id) => {
        return setDoc(doc(db, "entries", id), entry);
      }

      export const updateEntry = (id, entry) => {
        return entriesCollection.doc(id).update(entry)
      }

      export const getEntries = () => {
        const docRef = collection(db, 'entries');
        return getDocs(docRef);
      }

      export const deleteEntry = id => {
        return deleteDoc(doc(db, 'entries', id));
      }

      export const userLoadEntries = () => {
          const entries = ref([])
          const close = entriesCollection.onSnapshot(
              snapshot => {
                  entries.value = snapshot.docs.map(doc => ({
                        id: doc.id, ...doc.data() }))
      })
      onUnmounted(close)
      return entries
    }
