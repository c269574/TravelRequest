public with sharing class tripController {
    
    @AuraEnabled(cacheable = true)
    public static List < Trip__c > getTrips() {
        List < Trip__c > returnedList = new List < Trip__c > ();
        returnedList = [select id, CreatedDate, CreatedById, CurrencyIsoCode, Trip_ManagerEmail__c, Trip_EventId__c, Trip_HCPId__c, LastModifiedById, OwnerId, Name, Trip_Vovremya__c, Trip_City__c, Trip_DogovorDate__c, Trip_SendDate__c, Trip_Birthdate__c, Trip_KodPoezdki__c, Trip_Company__c, Trip_CoC__c, Trip_DogovorName__c, Trip_EmailApprover__c, Trip_ApproveDirector__c, Trip_Name__c, Trip_PrichinaPozdnego__c, Trip_Ran__c, Trip_Passport__c, Trip_Status__c, Trip_Phone__c, Trip_TipKomandirovki__c, Trip_TravelEmails__c, Trip_TselKomandirovki__c from Trip__c where CreatedById =: UserInfo.getUserId() order by createddate desc];
        System.debug(returnedList.size());
        return returnedList;
    }

    @AuraEnabled
    public static String deleteTrip(String tripId) {
        Trip__c trip = new Trip__c(Id = tripId);
        delete trip;
        return 'Record was deleted';
    }

    @AuraEnabled
    public static String sendRequest(String tripId) {
        trip__c trip = [select id, Trip_SendDate__c, Trip_Status__c from Trip__c where id =: tripId limit 1];
        if (trip != null) {
            trip.Trip_SendDate__c = System.today();
            trip.Trip_Status__c = 'Sent';
            update trip;
        }
        return 'Record was sent';
    }

    @AuraEnabled
    public static String returnRequest(String tripId) {
        trip__c trip = [select id, Trip_SendDate__c, Trip_Status__c from Trip__c where id =: tripId limit 1];
        if (trip != null) {
            trip.Trip_SendDate__c = null;
            trip.Trip_Status__c = 'Draft';
            update trip;
        }
        return 'Record was returned';
    }
}