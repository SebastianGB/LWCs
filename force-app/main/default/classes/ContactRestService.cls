/**
 * @description       : 
 * @author            : Sebastian Garcia
 * @group             : Business Applications
 * @last modified on  : 09-23-2025
 * @last modified by  : Sebastian Garcia
**/
@RestResource(urlMapping='/contacts/*')
global with sharing class ContactRestService {

    global class ResponseWrapper {
        public String status;
        public String message;
        public List<String> successfulContactIds;
        public List<ErrorResult> errors;
    }

    global class ErrorResult {
        public String recordId;
        public String externalId;
        public String errorMessage;
    }
    
    global class ContactWrapper {
        public String FirstName;
        public String LastName;
    }

    @HttpPost
    global static void createContacts() {
    
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;

        ResponseWrapper response = new ResponseWrapper();
        response.successfulContactIds = new List<String>();
        response.errors = new List<ErrorResult>();
 
        try {
            List<Contact> contactsToInsert = new List<Contact>();
            List<ContactWrapper> incomingContacts = (List<ContactWrapper>) JSON.deserialize(req.RequestBody.toString(), List<ContactWrapper>.class);

            for (contactWrapper wrapper: incomingContacts) {
                contactsToInsert.add(new Contact(FirstName = wrapper.FirstName, LastName = wrapper.LastName));
            }

            if (!contactsToInsert.isEmpty()) {
                Database.SaveResult[] results = Database.insert(contactsToInsert, false);

                for (Database.SaveResult result : results) {
                    if (result.isSuccess()) {
                        response.successfulContactIds.add(result.getId());
                        System.debug('result ' + result);
                    } else {
                        for (Database.Error error : result.getErrors()) {
                            System.debug('Error: ' + error.getMessage());
                        }
                    }
                }
            }

            res.statusCode = 201;
            res.responseBody = Blob.valueOf('{"status": "success", "message": "Contacts created successfully."}');
        } catch (Exception error) {
            res.statusCode = 400;
            res.responseBody = Blob.valueOf('{"status": "error", "message": "' + error.getMessage() + '"}');
        }
    }
}