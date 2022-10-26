import { api, LightningElement } from 'lwc';
import getRelatedRecords from '@salesforce/apex/EnhancedRelatedListController.getRelatedRecords';

const columns = [
    { label: 'Id', fieldName: 'Id', type: 'text' },
    { label: 'Name', fieldName: 'Name', type: 'text'}
  
];

export default class EnhancedRelatedList extends LightningElement {
    @api recordId;
    
    data = [];
    error;
    columns = columns;
    rowLimit = 30;
    rowOffSet = 0;
    isAllDataLoaded = false;
  
    connectedCallback() {
        this.loadData();
    }

    loadData(){
        return  getRelatedRecords({ id: this.recordId, limitSize: this.rowLimit , offset : this.rowOffSet })
        .then(result => {
            this.isAllDataLoaded = !result.length;
            let updatedRecords = [...this.data, ...result];
            this.data = updatedRecords;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.data = undefined;
        });
    }

    loadMoreData(event) {
        const { target } = event;
        target.isLoading = true;

        this.rowOffSet = this.rowOffSet + this.rowLimit;
        if (!this.isAllDataLoaded) {
            this.loadData()
                .then(()=> {
                    target.isLoading = false;
                });   
        } else {
            target.isLoading = false;
        }
    }
}