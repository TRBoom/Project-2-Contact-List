import '../scss/main.scss';
import 'bootstrap';
import JsonBox from './jsonbox';
import View from './view';

const store = new JsonBox('https://jsonbox.io/box_b69f1f79bb2a99d9afdb', 'contacts');

// Register handlers with the view instance
const view = new View();
view.registerOnEditContactHandler(openContact);
view.registerOnContactRemoveHandler(removeContact);
view.registerOnContactSaveHandler(saveContact);
view.registerOnSearchHandler(searchNotes);

// Load & display all the contacts when first arriving
loadContacts();

// Main application functions which call upon jsonbox and the view to accomplish the task
async function saveContact(data, contactId) {
    let contact = null;

    if (!contactId) {
        contact = await store.add(data);
    } else {
        await store.update(contactId, data);
        contact = await store.ofId(contactId);
    }
    view.hideContactDialog();
    view.renderContact(contact);
}

async function openContact(contactId) {
    const contact = await store.ofId(contactId);
    view.showContactDialog(contact);
}

async function removeContact(contactId) {
    await store.delete(contactId);
    view.removeContact(contactId);
}

async function loadContacts() {
    const contacts = await store.all();
    view.renderContactList(contacts);
}

async function searchNotes(searchTerm) {
    if (!searchTerm) {
        loadNotes();
    }

    const notes = await store.search({ name: `*${searchTerm}*` });
    view.renderContactList(notes);
}


var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;
document.getElementById("datefield").setAttribute("max", today);

