import { LightningElement, api, wire } from 'lwc';
import deleteTrip from '@salesforce/apex/tripController.deleteTrip';
import sendRequest from '@salesforce/apex/tripController.sendRequest';
import returnRequest from '@salesforce/apex/tripController.returnRequest';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { fireEvent } from 'c/pubsub';

export default class TripListItem extends LightningElement {
    @api record;
    get isDraft() {
        return this.record.Trip_Status__c === 'Draft';
    }

    @wire(CurrentPageReference) pageRef;
    deleteHandler() {
        deleteTrip({ tripId: this.record.Id })
            .then(result => {
                this.dispatchEvent(new CustomEvent('refresh', { bubbles: true }));
                const eventNew = new ShowToastEvent({
                    title: 'Success', variant: 'success', message: result
                });
                this.dispatchEvent(eventNew);

            })
            .catch(error => {
                const eventNew = new ShowToastEvent({
                    title: 'Error', variant: 'error', message: error,
                });
                this.dispatchEvent(eventNew);
            })
    }
    openHandler2() {
        fireEvent(this.pageRef, "opendetails", this.record.Id);
    }
    openHandler() {
        fireEvent(this.pageRef, "opendetails", this.record);
    }
    openLinkHandler() {
        window.open('/' + this.record.Id, '_blank');
    }
    sendHandler() {
        sendRequest({ tripId: this.record.Id })
            .then(result => {
                this.dispatchEvent(new CustomEvent('refresh', { bubbles: true })); // для @api record
                const eventNew = new ShowToastEvent({
                    title: 'Success', variant: 'success', result
                });
                this.dispatchEvent(eventNew);
            })
            .catch(error => {
                const eventNew = new ShowToastEvent({
                    title: 'Error', variant: 'error', message: error,
                });
                this.dispatchEvent(eventNew);
            })
    }
    returnHandler() {
        returnRequest({ tripId: this.record.Id })
            .then(result => {
                this.dispatchEvent(new CustomEvent('refresh', { bubbles: true }));
                const eventNew = new ShowToastEvent({
                    title: 'Success', variant: 'success', message: result
                });
                this.dispatchEvent(eventNew);
            })
            .catch(error => {
                const eventNew = new ShowToastEvent({
                    title: 'Error', variant: 'error', message: error,
                });
                this.dispatchEvent(eventNew);
            })
    }
}