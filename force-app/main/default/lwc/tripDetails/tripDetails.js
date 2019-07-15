import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { fireEvent } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TripDetails extends LightningElement {
    @track record;
    @track fields = ["Trip_Company__c", "Trip_KodPoezdki__c"];
    @wire(CurrentPageReference) pageRef;

    get isDraft() {
        return this.record.Trip_Status__c === 'Draft';
    }
    connectedCallback() {
        registerListener('opendetails', this.handleEventik, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handleEventik(record) {
        this.record = record;
        if (this.record) {
            // Assign fields conditionally
            // If you know better practices let me know! :)
            this.fields = ["Trip_Company__c", "Trip_KodPoezdki__c"];
            if (this.record.Trip_KodPoezdki__c.includes("(HCP)")) {
                this.fields.push("Trip_EventId__c", "Trip_HCPId__c");
            }
            if (this.record.Trip_KodPoezdki__c.includes("ГПХ")) {
                this.fields.push("Trip_DogovorName__c", "Trip_DogovorDate__c");
            }
            this.fields.push("Trip_Name__c", "Trip_City__c", "Trip_Phone__c");
            if (this.record.Trip_KodPoezdki__c.includes("Треть")) {
                this.fields.push("Trip_Birthdate__c", "Trip_Passport__c");
            }
            this.fields.push("Trip_TipKomandirovki__c", "Trip_CoC__c");
            if (this.record.Trip_TipKomandirovki__c.includes("Foreign")) {
                this.fields.push("Trip_TselKomandirovki__c");
            }
        }
        const event = new ShowToastEvent({
            title: 'Получили данные из листа поездок!',
            variant: 'success',
            message: 'Получили Id: ' + this.record.Id
        });
        this.dispatchEvent(event);
    }
    closeHandler() {
        this.record = null;
    }

    handleSuccess() {
        fireEvent(this.pageRef, "refresh");
        const event = new ShowToastEvent({
            title: 'Record updated', variant: 'success', message: ''
        });
        this.dispatchEvent(event);
    }
}