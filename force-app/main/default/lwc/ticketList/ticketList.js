import {
    LightningElement,
    api
} from 'lwc';
export default class TicketList extends LightningElement {
    @api tickets;
}