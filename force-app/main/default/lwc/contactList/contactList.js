import { LightningElement } from 'lwc';
import { api, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_CREATED from '@salesforce/messageChannel/ContactCreated__c';
import getContactsByAccountId from '@salesforce/apex/ContactController.getContactsByAccountId';

const COLUMNS = [
    {label: 'First Name', fieldName: 'FirstName'},
    {label: 'Last Name', fieldName: 'LastName'},
    {label: 'Email', fieldName: 'Email'},
    {label: 'Phone', fieldName: 'Phone'}
];


export default class ContactList extends LightningElement {
    columns = COLUMNS;
    @api recordId;

    @wire(getContactsByAccountId, {accountId: '$recordId'})
    contacts;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        subscribe(this.messageContext, CONTACT_CREATED, () => {
            this.refreshContacts();
        });
    }

    async refreshContacts() {
        try {
            await refreshApex(this.contacts);
        } catch (error) {
            const errorToast = new ShowToastEvent({
                title: 'Error',
                message: error.body.message,
                variant: 'error',
            });
            this.dispatchEvent(errorToast);
        }
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }

    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription, () => {
            this.subscription = null;
        });
    }
}