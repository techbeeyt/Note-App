const list = document.querySelector('.ul');
const form = document.querySelector('.form-group');
const search = document.querySelector('.search-field input');

const editContainer = document.querySelector('.edit_container')
const editForm = document.querySelector('.editFormGroup')

// creating the note
const addNote = (note, id, ) => {
    let date = new Date(note.Created_at.seconds * 1000)
    // let time = note.Created_at.toDate();
    // const date = new Date(note.Created_at.toMillis());
    const time = date.toLocaleString();
    // const timestamp = snapshot.get('Created_at');
    // const time = timestamp.toDate();
    let html = `
    <li data-id="${id}">
        <div class="card-big-shadow">
            <div class="card card-just-text" data-background="color" data-color="blue" data-radius="none">
                <div class="content">
                    <h4 class="title">${note.Title}</h4>
                    <p class="description">${note.Description}</p>
                    <p class="checkbox-important"></p>
                    <div class="created-at">${time}</div>
                    <i id="btn-delete" class="fas fa-trash-alt"></i>
                    <i class="fas fa-edit"></i>
                </div>
            </div>       
        </div>
    </li>
    `;

    list.innerHTML += html;

}

// delete function
const deleteNote = (id) => {
    const Notes = document.querySelectorAll('li');
    Notes.forEach(note => {
        if (note.getAttribute('data-id') === id) {
            note.remove();
        }
    });
}

//updating note
const updateNote = (data, id) => {

    const getNote = document.querySelector(`li[data-id="${id}"]`);

    const oldTitle = getNote.querySelector('.title');
    const oldDescription = getNote.querySelector('.description');
    let oldImportant = getNote.querySelector('.checkbox-important');

    oldTitle.innerText = data.Title;
    oldDescription.innerText = data.Description;

    if(data.Important) {
        oldImportant.style.display = "Important";
    }

    else {
        oldImportant.style.display = "";
    }
    form.reset();
}

// const updateNote = (data, id) => {

//     const getNote = document.querySelector(`li[data-id="${id}"]`);

//     const oldTitle = getNote.querySelector('.title');
//     const oldDescription = getNote.querySelector('.description');
//     let oldImportant = getNote.querySelector('.checkbox-important');

//     oldTitle.innerText = data.Title;
//     oldDescription.innerText = data.Description;

//     if(data.Important) {
//         oldImportant.innerText = "Important";
//     }

//     else {
//         oldImportant.innerText = "";
//     }

// }

// get documents - real-time
db.collection('Notes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {

        const doc = change.doc;

        if (change.type === 'added') {
            addNote(doc.data(), doc.id);
        } 
        
        else if (change.type === 'removed') {
            deleteNote(doc.id);

            return;
        }

        else if(change.type === 'modified') {
            updateNote(doc.data(), doc.id);
        }

        //Important check
        let getID = document.querySelector(`li[data-id="${doc.id}"]`);
        let importantText = getID.querySelector('.checkbox-important');

        if (doc.get('Important') === true) {
            importantText.innerText = 'Important';
        } else {
            importantText.innerText = '';
        }
    })
});

//add documents
form.addEventListener('submit', e => {
    e.preventDefault();

    const importantNote = document.querySelector('#important');
    let importantOutput = '';

    // boolean check html
    if (importantNote.checked) {
        importantOutput = true;
    } 
    
    else {
        importantOutput = false;
    }

    // outputting the data
    const now = new Date();
    const note = {
        Title: form.note1.value,
        Description: form.note2.value,
        Important: importantOutput,
        Created_at: firebase.firestore.Timestamp.fromDate(now),
    };

    db.collection('Notes').add(note).then(() => {})
        .catch(err => {});
    form.reset();
});

// displaying old data
list.addEventListener('click', e =>{
    if(e.target.className === 'fas fa-edit') { 
        const id = editContainer.getAttribute('data-id');

        const newTitle = document.querySelector('#editNote1');
        const newDescription = document.querySelector('#editNote2');
        const newImportant = document.querySelector('#editImportant');

        // const docRef = db.collection('Notes').doc(id);
        // const docSnapshot = await docRef.get();
        // const note = docSnapshot.data();
    
        // editForm.setAttribute('data-selected-id', id);
        // newTitle.value = doc.data().Title;
        // newDescription.value = doc.data().Description;
        // newImportant.checked = doc.data().Important;

        db.collection('Notes').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {

                const doc = change.doc;

                editContainer.setAttribute('data-id', id);

                newTitle.value = doc.data().Title;
                newDescription.value = doc.data().Description;
                newImportant.checked = doc.data().Important;

                // if (change.type === 'added') {
                //     addNote(doc.data(), doc.id);
                // } 
                
                // else if (change.type === 'removed') {
                //     deleteNote(doc.id);
        
                //     return;
                // }
        
                // else if(change.type === 'modified') {
                //     updateNote(doc.data(), doc.id);
                // }
        
                //Important check
                // let getID = document.querySelector(`li[data-id="${doc.id}"]`);
                // let importantText = getID.querySelector('.checkbox-important');
        
                // if (doc.get('Important') === true) {
                //     importantText.innerText = 'Important';
                // } else {
                //     importantText.innerText = '';
                // }
            })
        });
    }
});

// saving updated version
editForm.addEventListener('click', e => {

    e.preventDefault();        
    
    if(e.target.id === 'updateButton'){
        const update_date = new Date();
        const id = editContainer.getAttribute('data-id');
        let importantOutput = '';
        const importantNote = document.querySelector('#editImportant');

    // boolean check html
    if (importantNote.checked) {
        importantOutput = true;
    } 
    
    else {
        importantOutput = false;
    }

    const updateNote = {
        Title: editForm.editNote1.value,
        Description: editForm.editNote2.value,
        Important: importantOutput,
        Created_at: firebase.firestore.Timestamp.fromDate(update_date),
    };
        db.collection('Notes').doc(id).set(updateNote).then(() => {
            console.log('Note updated!');
        })
        .catch(err => {
            console.log(err);
        });
    
    } 
}); 

// // saving updated version
// editForm.addEventListener('click', e => {

//     e.preventDefault();        
        
//     const update_date = new Date();
//     const id = editContainer.getAttribute('data-id');
//     let importantOutput = '';
//     const importantNote = document.querySelector('#edit_important');

//     // boolean check html
//     if (importantNote.checked) {
//         importantNote = true;
//     } 
    
//     else {
//         importantNote = false;
//     }

//     const updateNote = {
//         Title: editForm.newTitle.value,
//         Description: editForm.newDescription.value,
//         Important: importantNote,
//         Created_at: firebase.firestore.Timestamp.fromDate(update_date),
//     }

//     db.collection('Notes').doc(id).update(updateNote).then(() => {
//         console.log('Note updated!');
//     })
//         .catch(err => {
//             console.log(err);
//         });  
// }); 

// edit button
list.addEventListener('click', e => {
    if(e.target.className === 'fas fa-edit')
    {
        editContainer.classList.add('edit-form-show');
    }
});

// closing edit window
window.addEventListener('click', e => {
    if(e.target === editContainer)
    editContainer.classList.remove('edit-form-show');
});


// deleting data button
list.addEventListener('click', e => {

    if (e.target.id === 'btn-delete') {
        const id = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
        db.collection('Notes').doc(id).delete().then(() => {   
        
        });
    }  
});

// searching for data
const filterNotes = (term) => {
    Array.from(list.children)
        .filter((note) => !note.textContent.toLowerCase().includes(term))
        .forEach((note) => note.classList.add('filtered'))

    Array.from(list.children)
        .filter((note) => note.textContent.toLowerCase().includes(term))
        .forEach((note) => note.classList.remove('filtered'))
};

search.addEventListener('keyup', () => {
    const term = search.value.trim().toLowerCase();

    filterNotes(term);
});