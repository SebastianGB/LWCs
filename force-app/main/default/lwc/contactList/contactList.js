import { LightningElement } from 'lwc';
import { api, wire } from 'lwc';
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
}