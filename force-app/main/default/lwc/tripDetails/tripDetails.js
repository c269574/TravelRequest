import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { fireEvent } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TripDetails extends LightningElement {
    @track record;
    @wire(CurrentPageReference) pageRef;

    get name() {
        return this.record.Name;
    }
    get status() {
        return this.record.Trip_Status__c;
    }
    get code() {
        return this.record.Trip_KodPoezdki__c;
    }
    get tip() {
        return this.record.Trip_TipKomandirovki__c;
    }
    get isHCP() {
        return this.code.includes("(HCP)");
    }
    get isGPH() {
        return this.code.includes("ГПХ");
    }
    get is3rd() {
        return this.code.includes("Треть");
    }
    get isForeign() {
        return this.tip.includes("Foreign");
    }
    get isDraft() {
        return this.status === 'Draft';
    }
    get isSent() {
        return this.status === 'Sent';
    }
    connectedCallback() {
        registerListener('opendetails', this.handleEventik, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handleEventik(record) {
        this.record = record;
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