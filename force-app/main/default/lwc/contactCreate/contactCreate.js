import { LightningElement } from 'lwc';
import { api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactCreate extends LightningElement {

    @api recordId;
    @api objectApiName;

    handleSubmit(event) {
        event.preventDefault();  
        const fields = event.detail.fields;
        fields.AccountId = this.recordId;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        this.resetFields();
        
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