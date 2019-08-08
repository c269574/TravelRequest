import { LightningElement, track, wire } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class TripCreator extends LightningElement {
    @track code = '';
    @track tip = '';
    @track isCreation = false;
    @wire(CurrentPageReference) pageRef;
    handleSuccess() {
        const event = new ShowToastEvent({
            title: 'Record Created',
            variant: 'success',
            message: ''
        });
        this.dispatchEvent(event);
        fireEvent(this.pageRef, "refreshTripList");
        this.cancelAndClear();
    }

    handleChange(event) {
        const targetName = event.target.dataset.name;
        if (targetName === 'code') {
            this.code = event.target.value;
        }
        else if (targetName === 'tip') {
            this.tip = event.target.value;
        }
        else if (targetName === 'newButton') {
            this.isCreation = true;
        }
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

    get isCreationDisabled() {
        if (this.code.length === 0 ||
            this.tip.length === 0) {
            return true;
        }
        return false;
    }

    cancelAndClear() {
        this.code = '';
        this.tip = '';
        this.isCreation = false;
    }
}