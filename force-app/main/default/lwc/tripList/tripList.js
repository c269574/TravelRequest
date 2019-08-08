import {
    LightningElement,
    wire
} from 'lwc';
import getTrips from '@salesforce/apex/tripController.getTrips';
import {
    registerListener,
    unregisterAllListeners
} from 'c/pubsub';
import {
    CurrentPageReference
} from 'lightning/navigation';
import {
    refreshApex
} from '@salesforce/apex';
export default class TripList extends LightningElement {

    @wire(CurrentPageReference) pageRef;
    @wire(getTrips) trips;
    connectedCallback() {
        registerListener('refreshTripList', this.handleRefreshTripList, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handleRefreshTripList() {
        return refreshApex(this.trips);
    }
}