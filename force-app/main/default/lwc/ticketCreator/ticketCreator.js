import { LightningElement, track, api } from 'lwc';
export default class TicketCreator extends LightningElement {
    @api trip;
    @track ticketFields = [
        "Trip__c",
        "Ticket_Point1__c",
        "Ticket_Point2__c",
        "Ticket_Date__c",
        "Ticket_PrefferedTime__c",
        "Ticket_Number__c",
        "Ticket_Class__c",
        "Ticket_Comment__c"
    ];

    handleTicketSuccess() {
        this.dispatchEvent(new CustomEvent('success')); // isTicketCreation = false
    }
}