public with sharing class tripController {

    public static final String SENT = 'Record was sent';
    public static final String DELETED = 'Record was deleted';
    public static final String RETURNED = 'Record was returned';

    @AuraEnabled(cacheable = true)
    public static List < Trip__c > getTrips() {
        List < Trip__c > returnedList = new List < Trip__c > ();
        returnedList = [SELECT id,
            CreatedDate,
            CreatedById,
            Trip_ManagerEmail__c,
            Trip_EventId__c,
            Trip_HCPId__c,
            Name,
            Trip_CountTickets__c,
            Trip_CountTransfers__c,
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
            Trip_Vovremya__c,
            Trip_TipKomandirovki__c,
            Trip_TravelEmails__c,
            Trip_TselKomandirovki__c
            from Trip__c where CreatedById =: UserInfo.getUserId() order by createddate desc
        ];
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
        String cxema = '';
        List < Date > ticketsDates = new List < Date > ();
        trip__c trip = [select id,
            Trip_Cxema__c,
            Trip_SendDate__c,
            Trip_Company__c,
            Trip_KodPoezdki__c,
            Trip_Vovremya__c,
            Trip_Status__c
            from Trip__c where id =: tripId limit 1
        ];
        if (trip != null) {
            List < Ticket__c > tickets = [SELECT Id,
                Name,
                Trip__c,
                Ticket_Date__c
                from Ticket__c WHERE Trip__c =: tripId
            ];
            if (tickets.size() > 0) {
                // 
                for (Ticket__c ticket: tickets) {
                    ticketsDates.add(ticket.Ticket_Date__c);
                }
                ticketsDates.sort();
                System.debug('tickets dates: ' + ticketsDates);
                Date samoeRannee = ticketsDates[0];
                // 
                Boolean lillyOffice = trip.Trip_Company__c.contains('Lilly') && trip.Trip_KodPoezdki__c.contains('офис');
                Boolean pharmaSales = trip.Trip_Company__c.contains('Pharma') && trip.Trip_KodPoezdki__c.contains('продаж');

                if (lillyOffice && samoeRannee < System.today().addDays(21)) {
                    trip.Trip_Vovremya__c = 'Нет';
                    trip.Trip_Cxema__c = 'Запорожец';
                } else if (pharmaSales && samoeRannee < System.today().addDays(21)) {
                    trip.Trip_Vovremya__c = 'Нет';
                    trip.Trip_Cxema__c = 'Ибрагимова';
                } else if (samoeRannee < System.today().addDays(14)) {
                    trip.Trip_Vovremya__c = 'Нет';
                    trip.Trip_Cxema__c = 'Позднее';
                } else {
                    trip.Trip_Cxema__c = 'Вовремя';
                    trip.Trip_Vovremya__c = 'Да';
                }
            } else {
                trip.Trip_Vovremya__c = 'Да';
                trip.Trip_Cxema__c = 'Вовремя';
            }
            trip.Trip_SendDate__c = System.today();
            trip.Trip_Status__c = 'Check';
            update trip;
        }
        // return SENT;
        return cxema;
    }

    @AuraEnabled
    public static void submitSend(String tripId) {
        trip__c trip = [select id,
            // Trip_SendDate__c,
            // Trip_Company__c,
            // Trip_KodPoezdki__c,
            // Trip_Vovremya__c,
            Trip_Status__c,
            Trip_Cxema__c,
            Trip_EmailApprover__c
            from Trip__c where id =: tripId limit 1
        ];

        if (trip.Trip_Cxema__c == 'Запорожец') {
            trip.Trip_EmailApprover__c = 'zapor@mail.ru';
        } else if (trip.Trip_Cxema__c == 'Ибрагимова') {
            trip.Trip_EmailApprover__c = 'ibragim@mail.ru';
        } else if (trip.Trip_Cxema__c == 'Позднее') {
            trip.Trip_EmailApprover__c = 'pozdno@mail.ru';
        } else if (trip.Trip_Cxema__c == 'Вовремя') {
            trip.Trip_EmailApprover__c = 'ontime@mail.ru';
        }
                    trip.Trip_Status__c = 'Sent';
        update trip;
    }

    @AuraEnabled
    public static String returnRequest(String tripId) {
        trip__c trip = [select id,
            Trip_SendDate__c,
            Trip_Status__c
            from Trip__c where id =: tripId limit 1
        ];
        if (trip != null) {
            trip.Trip_SendDate__c = null;
            trip.Trip_Status__c = 'Draft';
            update trip;
        }
        return RETURNED;
    }

    @AuraEnabled(cacheable = true)
    public static List < Ticket__c > getTickets(String recordId) {
        System.debug('getTickets: got recordId = ' + recordId);
        return [SELECT Id,
            Name,
            Ticket_Date__c,
            Ticket_Class__c,
            Ticket_Comment__c,
            Ticket_Point2__c,
            Ticket_Number__c,
            Ticket_Point1__c,
            Trip__c,
            Trip__r.Trip_Status__c,
            Ticket_PrefferedTime__c from Ticket__c where trip__c =: recordId
        ];
    }

    @AuraEnabled(cacheable = true)
    public static List < Transfer__c > getTransfers(String recordId) {
        return [SELECT Id,
            Name,
            Transfer_FromTo__c,
            Transfer_DateTime__c,
            Transfer_Comment__c,
            Transfer_Trip__c,
            Transfer_Trip__r.Trip_Status__c
            FROM Transfer__c where Transfer_Trip__c =: recordId
        ];
    }
}