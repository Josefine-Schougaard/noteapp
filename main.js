const list = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('#unsub');
const update = document.querySelectorAll('.update');
const addBtn = document.querySelector('#add');
const sUpdate = document.querySelector('#secretupdate');

const addNote = (note, id) =>{
    console.log(note);
    let time = note.created_at.toDate();
    let important = "";
    if(note.important === true){
        important = "important";
    }
    let html = `
    <li data-id="${id}" class="${important}">
    <div class="title">${note.title}</div>
    <div class="time">${time}</div>
    <div class="body">${note.body}</div>
    <button class="update btn btn-success btn-sm my-2">Update</button>
    <button class="delete btn btn-danger btn-sm my-2">Delete</button>
    </li>
    `;
    list.innerHTML+= html;
}


// gets all documents in notes collection
// db.collection('notes').get().then((snapshot)=>{
//     //when we have the data
//     snapshot.docs.forEach(doc => {
//         console.log(doc.id);
//        addNote(doc.data(), doc.id);
//     });
// }).catch(err=>{
//     console.log(err);
// });

//realtime test
// db.collection('notes').onSnapshot(snapshot =>{
//     console.log(snapshot);
// });

const updateNote = (id) =>{
    db.collection("notes").doc(id).update({
        body: form.body.value,
        title: form.note.value,
        important: document.querySelector('#important').checked
    }).then(()=>{
        console.log("updated")
        addBtn.classList.remove('d-none');
        const updateNote = document.querySelector('#secretupdate');
        updateNote.classList.add('d-none');
        updateNote.setAttribute('data-id','');
    }).catch(err => {
        console.log(id)
        console.log(err)
    });
}

const updateView = (note) =>{
    const li = document.querySelectorAll('li');
    console.log(li);
    console.log(note);
    console.log(note.data());
    const noteData = note.data();
    console.log(noteData.important);
    li.forEach(listItem =>{ 
        if(listItem.getAttribute('data-id') === note.id){
            listItem.querySelector('.title').innerHTML = noteData.title;
            listItem.querySelector('.body').innerHTML = noteData.body;
            listItem.querySelector('.time').innerHTML = noteData.created_at.toDate();
            if(noteData.important === true){
                listItem.classList.add('important');
            }
            else{
                listItem.classList.remove('important');
            }
        }
    })
}

const deleteNote = (id)=>{
    const notes = document.querySelectorAll('li');
    notes.forEach(note =>{
        if(note.getAttribute('data-id') === id){
            note.remove();
        }
    })
}

//realtime listener
const unsub = db.collection('notes').onSnapshot(snapshot =>{
    snapshot.docChanges().forEach(change =>{
        console.log(change.type);
        const doc = change.doc;
        if(change.type === 'added'){
            addNote(doc.data(), doc.id);
        }
        else if(change.type === 'modified'){
            updateView(doc);
        }
        else if(change.type === 'removed'){
            deleteNote(doc.id);
        }
    });
});

form.addEventListener('submit', e =>{
    e.preventDefault();
    const now = new Date();
    const note = {
        title: form.note.value,
        created_at: firebase.firestore.Timestamp.fromDate(now),
        body: form.body.value,
        important: document.querySelector('#important').checked
    };
    console.log(note);
    db.collection('notes').add(note).then(() =>{
        console.log('note added');
    }).catch(err=>{
        console.log(err);
    });
});

//deleting data
list.addEventListener('click', e =>{
    console.log(e);
    if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute('data-id');
        if(e.target.classList.contains('delete')){
            console.log(id)
            db.collection('notes').doc(id).delete().then(()=>{
                console.log('note deleted')
            });
        }
        else{
            addBtn.classList.add('d-none');
            const updateNote = document.querySelector('#secretupdate');
            updateNote.classList.remove('d-none');
            updateNote.setAttribute('data-id',id);
        }
    }
});

sUpdate.addEventListener('click', e=>{
    const id = e.target.getAttribute('data-id');
    updateNote(id);
});

button.addEventListener('click', ()=>{
    unsub();
    console.log('unsub');
})

const impBtn = document.querySelector("#imp-notes");

impBtn.addEventListener('click', e =>{
    const li = document.querySelectorAll('li');
    li.forEach((listItem)=>{
        if(!listItem.classList.contains('important')){
            listItem.classList.toggle('d-none');
        }
    })
});
