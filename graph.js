// tell the app what to do when data is updated
const update = (data) => {
    console.log(data);
}

// this serves as the current Firestore data array for index.js / html
var data = [];

// setup realtime listener
db.collection('activities').onSnapshot(res => {
    // retreive all the document changes
    res.docChanges().forEach(change => {
        
        // create a document that stores each change
        const doc = {
            // the spread (...) will take the Firestore doc data and "spread" each element in it into its own property within the object
            ...change.doc.data(),
            id: change.doc.id
        };

        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }
    });

    update(data);

})