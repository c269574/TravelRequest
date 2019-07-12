import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { fireEvent } from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { getRecord } from 'lightning/uiRecordApi';
// const myFields = [
//     'Trip__c.Name',
//     'Trip__c.Trip_Status__c',
//     'Trip__c.Trip_KodPoezdki__c',
//     'Trip__c.Trip_TipKomandirovki__c'
// ];

export default class TripDetails extends LightningElement {
    // @track recordId;
    @track record;
    @wire(CurrentPageReference) pageRef;
    // @wire(getRecord, {
    //     recordId: '$recordId', fields: myFields
    // }) record;

    // get name() {
    //     return this.record.data ? this.record.data.fields.Name.value : 'Name was not received';
    // }
    // get status() {
    //     return this.record.data ? this.record.data.fields.Trip_Status__c.value : 'Trip_Status__c was not received';
    // }
    // get code() {
    //     return this.record.data ? this.record.data.fields.Trip_KodPoezdki__c.value : 'Trip_KodPoezdki__c was not received';
    // }
    // get tip() {
    //     return this.record.data ? this.record.data.fields.Trip_TipKomandirovki__c.value : 'Trip_TipKomandirovki__c was not received';
    // }
    // get isHCP() {
    //     return this.code.includes("(HCP)");
    // }
    // get isGPH() {
    //     return this.code.includes("ГПХ");
    // }
    // get is3rd() {
    //     return this.code.includes("Треть");
    // }
    // get isForeign() {
    //     return this.tip.includes("Foreign");
    // }
    // get isDraft() {
    //     return this.record.data ? this.record.data.fields.Trip_Status__c.value === 'Draft' : false;
    // }
    // get isSent() {
    //     return this.record.data ? this.record.data.fields.Trip_Status__c.value === 'Sent' : false;
    // }

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