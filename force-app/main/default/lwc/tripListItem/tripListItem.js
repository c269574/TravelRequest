import {
    LightningElement,
    api,
    wire
} from 'lwc';
import deleteTrip from '@salesforce/apex/tripController.deleteTrip';
import {
    CurrentPageReference
} from 'lightning/navigation';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import {
    fireEvent
} from 'c/pubsub';

export default class TripListItem extends LightningElement {
    @api record;

    @wire(CurrentPageReference) pageRef;
    deleteHandler() {
        if (confirm) {
            const eventNew = new ShowToastEvent({
                title: 'Almost there!..',
                variant: 'success',
                message: ''
            });
            this.dispatchEvent(eventNew);
            deleteTrip({
                    tripId: this.record.Id
                })
                .then(() => {
                    this.dispatchEvent(new CustomEvent('refresh', {
                        bubbles: true
                    }));
                })
                .catch(() => {})
        }
    }
    openHandler() {
        fireEvent(this.pageRef, "opendetails", this.record.Id);
    }
    openLinkHandler() {
        window.open('/' + this.record.Id, '_blank');
    }
}