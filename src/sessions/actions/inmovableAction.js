/**
 * 
 * @param {*} firebase 
 * @param {*} sizePage 
 * @param {*} startPage 
 * @param {*} txt 
 */
export const getData = (firebase, sizePage, startPage, txt) => {
    return new Promise(async (resolve, reject) => {
        let inmovables = firebase.db.collection('inmovables')
            .orderBy('address')
            .limit(sizePage)

        if (startPage !== null) {
            inmovables = firebase.db
                .collection('inmovables')
                .startAfter(startPage)
                .limit(sizePage)

            if (txt.trim() !== '') {
                inmovables = firebase.db.collection('inmovables')
                    .orderBy('address')
                    .where('keywords', 'array-contains', txt.toLowerCase())
                    .startAfter(startPage)
                    .limit(sizePage)
            }
        }

        const snapshot = await inmovables.get();

        const listInmovables = snapshot.docs.map(doc => {
            let data = doc.data();
            let id = doc.id;
            return {
                id,
                ...data
            }
        })

        const startValue = snapshot.docs[0];
        const finishValue = snapshot.docs[snapshot.docs.length - 1]

        const returnValue = {
            listInmovables,
            startValue,
            finishValue
        }

        resolve(returnValue);
    })
}

/**
 * 
 * @param {*} firebase 
 * @param {*} sizePage 
 * @param {*} startPage 
 * @param {*} txt 
 */
export const getDataPrev = (firebase, sizePage, startPage, txt) => {
    return new Promise(async (resolve, reject) => {
        let inmovables = firebase.db.collection('inmovables')
            .orderBy('address')
            .limit(sizePage)

        if (startPage !== null) {
            inmovables = firebase.db.collection('inmovables')
                .orderBy('address')
                .startAt(startPage)
                .limit(sizePage)

            if (txt.trim() !== '') {
                inmovables = firebase.db.collection('inmovables')
                    .orderBy('address')
                    .where('keywords', 'array-contains', txt.toLowerCase())
                    .startAt(startPage)
                    .limit(sizePage)
            }
        }

        const snapshot = await inmovables.get();

        const listInmovables = snapshot.docs.map(doc => {
            let data = doc.data();
            let id = doc.id;
            return {
                id,
                ...data
            }
        })

        const startValue = snapshot.docs[0];
        const finishValue = snapshot.docs[snapshot.docs.length - 1]

        const returnValue = {
            listInmovables,
            startValue,
            finishValue
        }

        resolve(returnValue);
    })
}