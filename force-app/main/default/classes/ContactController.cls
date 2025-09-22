/**
 * @description       : 
 * @author            : Sebastian Garcia
 * @group             : Business Applications
 * @last modified on  : 09-22-2025
 * @last modified by  : Sebastian Garcia
**/
public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsByAccountId(String accountId) {
        return [SELECT Id, FirstName, LastName, Email, Phone FROM Contact WHERE AccountId = :accountId];
    }
}