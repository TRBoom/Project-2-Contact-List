import $ from 'jquery';

export default class View {
    constructor() {
        // Get DOM references
        this.contactModal = document.querySelector('#contactModal');
        this.contactForm = contactModal.querySelector('form');
        this.contactContainer = document.querySelector('#contactContainer');
        this.searchForm = document.querySelector('#searchForm');

        // Set up event handlers, need to bind to this so handlers have correct scope
        this.contactContainer.addEventListener('click', this.onContactClick.bind(this));
        this.contactForm.addEventListener('submit', this.onContactFormSubmit.bind(this));
        this.searchForm.addEventListener('submit', this.onSearchFormSubmit.bind(this));

        // A little jquery to clear the contact form when the modal is hidden
        $(this.contactModal).on('hide.bs.modal', () => this.contactForm.reset());
    }

    registerOnEditContactHandler(handler) {
        this.onEditContactHandler = handler;
    }

    registerOnContactSaveHandler(handler) {
        this.onContactSaveHandler = handler;
    }

    registerOnContactRemoveHandler(handler) {
        this.onContactRemoveHandler = handler;
    }

    registerOnSearchHandler(handler) {
        this.onSearchHandler = handler;
    }

    // Remove contact from the DOM
    removeContact(contactId) {
        const contactNode = this.contactContainer.querySelector(`div[data-contact-id="${contactId}"`);

        if (contactNode) {
            contactNode.parentElement.remove();
        }
    }

    // Show modal dialog with contact populated (or empty if no contact)
    showContactDialog(contact) {
        if (contact) {
            this.contactForm.contactId.value = contact._id;
            this.contactForm.contactName.value = contact.Name;
            this.contactForm.contactPhone.value = contact.phone;
            this.contactForm.contactEmail.value = contact.email;
            this.contactForm.contactBday.value = contact.bday;
            this.contactForm.contactType.value = contact.type;
            this.contactForm.contactNotes.value = contact.notes;
        }

        // jquery to show dialog
        $(this.contactModal).modal('show');
    }

    // Hides contact dialog
    hideContactDialog() {
        $(this.contactModal).modal('hide');
    }

    // Clear the screen and display the contacts
    renderContactList(contacts) {
        this.contactContainer.innerHTML = '';

        for (let contact of contacts) {
            this.contactContainer.append(this.createContactNode(contact));
        }
    }

    // Append a new contact to the DOM or replace an existing contact
    renderContact(contact) {
        const contactNode = this.createContactNode(contact);
        const existingNode = this.contactContainer.querySelector(`div[data-contact-id="${contact._id}"]`);
        existingNode ? existingNode.parentElement.replaceWith(contactNode) : this.contactContainer.prepend(contactNode);
    }

    createContactNode(contact) {
        const contactNode = document.createElement('div');

        contactNode.className = 'col-lg-6 col-md-12 pb-4 ';
        contactNode.innerHTML = `
            <div data-contact-id="${contact._id}" class="contact bg-contact-card m-3">

                <div class="contact-header d-flex justify-content-between">
                    <h2 class="contact-title"> Name: ${contact.name}</h2>
                   <button type="button" class="btn btn-delete">&times;</button>
                </div>

                <div class="contact-text">Phone: ${contact.phone}</div>

                <div class="contact-text">Email: ${contact.email}</div>

                <div class="contact-text">${age(contact.bday)}</div>

                <div class="contact-text">Contact Type: ${contact.type}</div>

                <div class="contact-notes">${contact.notes}</div>

                <div class="controls">
                   <button type="button" class="btn btn-edit">edit</button>
                </div>

            </div>`;

        return contactNode;
    }

    onContactClick(event) {
        const contactNode = event.target.closest('.contact');

        // We are contact sure where the contact was clicked at this point, have to investigate
        if (event.target.matches('.btn-delete')) {
            this.onContactRemoveHandler(contactNode.dataset.contactId);
        } else if (event.target.matches('.btn-edit')) {
            this.onEditContactHandler(contactNode.dataset.contactId);
        }
    }

    onContactFormSubmit(event) {
        event.preventDefault();

        // Prepare the data for the registered handler
        const data = {
            name: this.contactForm.contactFirst.value+" "+this.contactForm.contactLast.value,
            phone: this.contactForm.contactPhone.value,
            email: this.contactForm.contactEmail.value,
            bday: this.contactForm.contactBday.value,
            type: this.contactForm.contactType.value,
            notes: this.contactForm.contactNotes.value
        };
        this.onContactSaveHandler(data, this.contactForm.contactId.value);
    }
    
    onSearchFormSubmit(event) {
        event.preventDefault();

        this.onSearchHandler(this.searchForm.search.value);
    }
}



function age(dob){
    if (!dob){
        return ""
    }


    var year = Number(dob.substr(0, 4));
    var month = Number(dob.substr(4, 2)) - 1;
    var day = Number(dob.substr(6, 2));
    var today = new Date();
    var age = today.getFullYear() - year;
    if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
        age--;
    }
    return(age+' years old');
    }

