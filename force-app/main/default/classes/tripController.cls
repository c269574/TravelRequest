public with sharing class tripController {

    public static final String SENT = 'Record was sent';
    public static final String DELETED = 'Record was deleted';
    public static final String RETURNED = 'Record was returned';

    @AuraEnabled(cacheable = true)
    public static List < Trip__c > getTrips() {
        List < Trip__c > returnedList = new List < Trip__c > ();
        returnedList = [select id, 
        CreatedDate, 
        CreatedById, 
        Trip_ManagerEmail__c, 
        Trip_EventId__c,
        Trip_HCPId__c, 
        Name, 
        Trip_City__c, 
        Trip_DogovorDate__c, 
        Trip_SendDate__c, 
        Trip_Birthdate__c, 
        Trip_KodPoezdki__c, 
        Trip_Company__c, 
        Trip_CoC__c, 
        Trip_DogovorName__c, 
        Trip_EmailApprover__c, 
        Trip_ApproveDirector__c, 
        Trip_Name__c, 
        Trip_Passport__c, 
        Trip_Status__c, 
        Trip_Phone__c, 
        Trip_TipKomandirovki__c, 
        Trip_TravelEmails__c, 
        Trip_TselKomandirovki__c 
        from Trip__c where CreatedById =: UserInfo.getUserId() order by createddate desc];
        System.debug(returnedList.size());
        return returnedList;
    }

    @AuraEnabled
    public static String deleteTrip(String tripId) {
        Trip__c trip = new Trip__c(Id = tripId);
        delete trip;
        return DELETED;
    }

    @AuraEnabled
    public static String sendRequest(String tripId) {
        trip__c trip = [select id, 
        Trip_SendDate__c, 
        Trip_Status__c 
        from Trip__c where id =: tripId limit 1];
        if (trip != null) {
            trip.Trip_SendDate__c = System.today();
            trip.Trip_Status__c = 'Sent';
            update trip;
        }
        return SENT;
    }

    @AuraEnabled
    public static String returnRequest(String tripId) {
        trip__c trip = [select id, 
        Trip_SendDate__c, 
        Trip_Status__c 
        from Trip__c where id =: tripId limit 1];
        if (trip != null) {
            trip.Trip_SendDate__c = null;
            trip.Trip_Status__c = 'Draft';
            update trip;
        }
        return RETURNED;
    }
}