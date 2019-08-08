import {
    LightningElement,
    api,
    track,
    wire
} from 'lwc';
import {
    deleteRecord
} from 'lightning/uiRecordApi';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
import {
    fireEvent
} from 'c/pubsub';
import {
    CurrentPageReference
} from 'lightning/navigation';
export default class TicketListItem extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @api transfer;
    @track transferfields = [
        "Transfer_FromTo__c",
        "Transfer_DateTime__c",
        "Transfer_Comment__c",
        "Transfer_Trip__c",
    ];

    get isDraft() {
        return this.transfer.Transfer_Trip__r.Trip_Status__c === 'Draft';
    }
    handleDelete() {
        const deletedId = this.transfer.Id;
        deleteRecord(deletedId)
            .then(() => {
                fireEvent(this.pageRef, "refreshTripList"); // Вызвать Refresh of tripList
                fireEvent(this.pageRef, "refreshTransferList"); // Вызвать apexRefresh of transfers
                const eventNew = new ShowToastEvent({
                    title: 'Deleted',
                    variant: 'success',
                    message: '',
                });
                this.dispatchEvent(eventNew);
            })
        // .catch(() => { })
    }
}