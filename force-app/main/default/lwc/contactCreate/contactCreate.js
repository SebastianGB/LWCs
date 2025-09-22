import { LightningElement } from 'lwc';
import { api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {publish, MessageContext } from 'lightning/messageService';
import CONTACT_CREATED from '@salesforce/messageChannel/ContactCreated__c';

export default class ContactCreate extends LightningElement {

    @api recordId;
    @api objectApiName;
    @wire(MessageContext)
    MessageContext;

    handleSubmit(event) {
        event.preventDefault();  
        const fields = event.detail.fields;
        fields.AccountId = this.recordId;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess() {
        this.resetFields();

        publish(this.MessageContext, CONTACT_CREATED);
        
        const successToast = new ShowToastEvent({
            title: 'Success',
            message: 'Contact created',
            variant: 'success',
        });
        this.dispatchEvent(successToast);
    }

    resetFields() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
}