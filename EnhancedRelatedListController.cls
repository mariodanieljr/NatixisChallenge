public with sharing class EnhancedRelatedListController {
    @AuraEnabled(cacheable=true)
    public static List<SObject> getRelatedRecords(String id, Integer limitSize, Integer offset){
        List<ObjectB__c> objBRecs = [
            SELECT 
                Id, 
                Name, 
                (SELECT Id, Name FROM ObjectC__r)
            FROM ObjectB__c
            WHERE ObjectA__c = :id
            ORDER BY CreatedDate
            LIMIT :limitSize
            OFFSET :offset ];

        List<SObject> allRecords = new List<SObject>();

        allRecords.addAll(objBRecs);
        for (ObjectB__c item : objBRecs) {
            allRecords.addAll(item.ObjectC__r);
        }

        return allRecords;
    }
}