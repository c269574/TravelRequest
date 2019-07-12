# TravelRequest. Lightning Web Components practice

## Content:
### Apex Class - tripController.

#### LWC:
#### tripCreator:
> Contains lightning-record-edit-form and button to create Trip record.
> After submitting, component fires component-to-component 'refresh' event and dispatches it to tripList component: tripList refreshes.

#### tripList:
> Iteration of all Trip__c records with tripListItem component.

#### tripListItem (Child of tripList):
> Displays passenger's name and request's status.
> Contains 5 buttons:
> - Open record in Salesforce (document.open*)
> - Open record in tripDetails component (Fires 'opendetails' event, tripDetails listens to 'opendetails' event, gets record's details)
> - Delete record from org and tripList (Runs 'deleteTrip' apex method, on success dispatches child-to-parent event to tripList. tripList refreshes Apex)
> - Send record for approval (Runs 'sendRequest' apex method, on success dispatches child-to-parent 'refresh' event to tripList. tripList refreshes Apex)
> - Return record to draft status (Runs 'returnRequest' apex method, on success dispatches child-to-parent 'refresh' event to tripList. tripList refreshes Apex)

#### tripDetails:
> After receiving the record from tripListItem, displays fields values:
> - if Status = Draft => lightning-record-edit-form
> - if Status = Sent => lightning-record-view-form
> After update submitting, component fires component-to-component 'refresh' event and dispatches it to tripList component: tripList refreshes.

![State 1](https://github.com/110692y/TravelRequest/blob/master/assets/Home1.png)
<hr/>

![State 1](https://github.com/110692y/TravelRequest/blob/master/assets/Home2.png)
<hr/>

![State 3](https://github.com/110692y/TravelRequest/blob/master/assets/Home3.png)
