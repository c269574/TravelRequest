import {
    LightningElement,
    track,
    api
} from 'lwc';
export default class TransferCreator extends LightningElement {
    @api trip;
    @track transferFields = [
        // "Name",
        "Transfer_FromTo__c",
        "Transfer_DateTime__c",
        "Transfer_Comment__c",
        "Transfer_Trip__c"
    ];

    handleTransferSuccess() {
        this.dispatchEvent(new CustomEvent('success')); // isTransferCreation = false
    }
}