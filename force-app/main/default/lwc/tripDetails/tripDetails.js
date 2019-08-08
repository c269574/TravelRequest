import {
    LightningElement,
    track,
    wire
} from 'lwc';
import sendRequest from '@salesforce/apex/tripController.sendRequest';
import returnRequest from '@salesforce/apex/tripController.returnRequest';
import submitSend from '@salesforce/apex/tripController.submitSend';
import getTransfers from '@salesforce/apex/tripController.getTransfers';
import getTickets from '@salesforce/apex/tripController.getTickets';
import {
    CurrentPageReference
} from 'lightning/navigation';
import {
    registerListener,
    unregisterAllListeners
} from 'c/pubsub';
import {
    fireEvent
} from 'c/pubsub';
import {
    getRecord
} from 'lightning/uiRecordApi';
import {
    refreshApex
} from '@salesforce/apex';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';
const tripRetrievedFields = [
    // We need only reactive fields: Status, Code, Type, CountTickets, CountTransfers__c.
    // But mb I will need to pass the whole record:
    "Trip__c.Trip_Status__c", "Trip__c.Trip_CountTickets__c", "Trip__c.Trip_CountTransfers__c",
    "Trip__c.Trip_Vovremya__c", "Trip__c.Name",
    "Trip__c.Trip_Company__c", "Trip__c.Trip_KodPoezdki__c",
    "Trip__c.Trip_EventId__c", "Trip__c.Trip_HCPId__c",
    "Trip__c.Trip_DogovorName__c", "Trip__c.Trip_DogovorDate__c",
    "Trip__c.Trip_Name__c", "Trip__c.Trip_City__c", "Trip__c.Trip_Phone__c",
    "Trip__c.Trip_Birthdate__c", "Trip__c.Trip_Passport__c",
    "Trip__c.Trip_TipKomandirovki__c", "Trip__c.Trip_CoC__c",
    "Trip__c.Trip_TselKomandirovki__c"
];



export default class TripDetails extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    @track tripId;

    connectedCallback() {
        registerListener('opendetails', this.handleConnected, this);
        registerListener('refreshTicketList', this.refreshDetailsComponent, this);
        registerListener('refreshTransferList', this.refreshDetailsComponent, this);
        registerListener('refreshDetails', this.refreshDetailsComponent, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handleConnected(tripId) {
        this.tripId = tripId;
        const event = new ShowToastEvent({
            title: 'Получил Id из листа поездок: ' + this.tripId,
            variant: 'success',
            message: ''
        });
        this.dispatchEvent(event);
    }

    @wire(getRecord, {
        recordId: '$tripId',
        fields: tripRetrievedFields
    }) trip;

    get tripDisplayedFields() {
        let array = ["Trip_Company__c", "Trip_KodPoezdki__c"];
        if (this.trip.data) {
            if (this.trip.data.fields.Trip_KodPoezdki__c.value.includes("(HCP)")) {
                array.push("Trip_EventId__c", "Trip_HCPId__c");
            }
            if (this.trip.data.fields.Trip_KodPoezdki__c.value.includes("ГПХ")) {
                array.push("Trip_DogovorName__c", "Trip_DogovorDate__c");
            }
            array.push("Trip_Name__c", "Trip_City__c", "Trip_Phone__c");
            if (this.trip.data.fields.Trip_KodPoezdki__c.value.includes("Треть")) {
                array.push("Trip_Birthdate__c", "Trip_Passport__c");
            }
            array.push("Trip_TipKomandirovki__c", "Trip_CoC__c");
            if (this.trip.data.fields.Trip_TipKomandirovki__c.value.includes("Foreign")) {
                array.push("Trip_TselKomandirovki__c");
            }
        }
        return array;
    }

    get tripPozdneeFields() {
        let array = ["Trip_PrichinaPozdnego__c", "Trip_ManagerEmail__c", "Trip_ApproveDirector__c"];
        if (this.trip.data) {
            if (this.trip.data.fields.Trip_Vovremya__c.value === "Нет") {
                array.push("Trip_EmailApprover__c");
            }
        }
        return array;
    }
    get isPozdnee() {
        return this.trip.data.fields.Trip_Vovremya__c.value === 'Нет';
    }
    get isDraft() {
        return this.trip.data.fields.Trip_Status__c.value === 'Draft';
    }
    get isNotDraft() {
        return this.trip.data.fields.Trip_Status__c.value !== 'Draft';
    }
    get isCheck() {
        return this.trip.data.fields.Trip_Status__c.value === 'Check';
    }
    get itemName() {
        return this.trip.data ? this.trip.data.fields.Name.value + ', ' + this.trip.data.fields.Trip_Status__c.value : '';
    }

    get isTickets() {
        return this.trip.data ? this.trip.data.fields.Trip_CountTickets__c.value > 0 : 'error';
    }
    get countTickets() {
        return this.trip.data ? this.trip.data.fields.Trip_CountTickets__c.value : 'error';
    }
    get isTransfers() {
        return this.trip.data ? this.trip.data.fields.Trip_CountTransfers__c.value > 0 : 'error';
    }
    get countTransfers() {
        return this.trip.data ? this.trip.data.fields.Trip_CountTransfers__c.value : 'error';
    }

    handleSuccess() {
        fireEvent(this.pageRef, "refreshTripList");
        const event = new ShowToastEvent({
            title: 'Record updated',
            variant: 'success',
            message: ''
        });
        this.dispatchEvent(event);
    }


    @track ticketCreation;
    @track transferCreation;

    startTicketCreation() {
        this.ticketCreation = true;
    }
    startTransferCreation() {
        this.transferCreation = true;
    }
    refreshDetailsComponent() {
        refreshApex(this.trip);
        this.ticketCreation = false;
        this.transferCreation = false;
        fireEvent(this.pageRef, "refreshTripList"); // Обновляет tripList
        refreshApex(this.transfers);
        refreshApex(this.tickets);
    }

    //  Ticket List:
    @wire(getTickets, {
        recordId: '$tripId'
    }) tickets;
    // Transfer List:
    @wire(getTransfers, {
        recordId: '$tripId'
    }) transfers;

    closeHandler() {
        this.tripId = null;
        this.trip.data = null;
    }

    checkHandler() {
        sendRequest({
                tripId: this.tripId
            })
            .then(result => {
                this.refreshDetailsComponent();
                const eventNew = new ShowToastEvent({
                    title: 'Success',
                    variant: 'success',
                    message: result
                });
                this.dispatchEvent(eventNew);
            })
            .catch(error => {
                const eventNew = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: error,
                });
                this.dispatchEvent(eventNew);
            })
    }
    sendHandler() {
        submitSend({
                tripId: this.tripId
            })
            .then(() => {
                this.refreshDetailsComponent();
            })
            .catch(() => {

            });
    }
    @track isModal = false;

    handleModal() {
        this.isModal = !this.isModal;
    }

    returnHandler() {
        returnRequest({
                tripId: this.tripId
            })
            .then(result => {
                this.refreshDetailsComponent();
                const eventNew = new ShowToastEvent({
                    title: 'Success',
                    variant: 'success',
                    message: result
                });
                this.dispatchEvent(eventNew);
            })
            .catch(error => {
                const eventNew = new ShowToastEvent({
                    title: 'Error',
                    variant: 'error',
                    message: error,
                });
                this.dispatchEvent(eventNew);
            })
    }
}