import { LightningElement, wire, track } from 'lwc';
import getTrips from '@salesforce/apex/tripController.getTrips';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
export default class TripList extends LightningElement {
    @track count = 0;
    @wire(CurrentPageReference) pageRef;
    @wire(getTrips) trips;
    connectedCallback() {
        registerListener('refresh', this.handleUpdate, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handleUpdate() {
        return refreshApex(this.trips);
    }
}