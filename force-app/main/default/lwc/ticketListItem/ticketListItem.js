import { LightningElement, api, track, wire } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
export default class TicketListItem extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @api ticket;
    @track ticketfields = [
        "Ticket_Point1__c",
        "Ticket_Point2__c",
        "Ticket_Date__c",
        "Ticket_PrefferedTime__c",
        "Ticket_Number__c",
        "Ticket_Class__c",
        "Ticket_Comment__c"
    ];

    get isDraft() {
        return this.ticket.Trip__r.Trip_Status__c === 'Draft';
    }
    handleDelete() {
        const deletedId = this.ticket.Id;
        deleteRecord(deletedId)
            .then(() => {
                fireEvent(this.pageRef, "refreshTripList"); // Вызвать Refresh of tripList
                fireEvent(this.pageRef, "refreshTicketList"); // Вызвать apexRefresh of tickets

                // this.dispatchEvent('refreshticketlist', { bubbles: true });// Вызвать apexRefresh of tickets
                const eventNew = new ShowToastEvent({
                    title: 'Deleted', variant: 'success', message: '',
                });
                this.dispatchEvent(eventNew);
            })
        // .catch(() => { })
    }
}