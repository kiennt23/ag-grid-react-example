import * as React from 'react';
import './App.css';
import {AgGridReact} from 'ag-grid-react';
import {ColDef, GridApi} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import {MouseEvent} from "react";

export interface AppProps {
    columnDefs?: ColDef[];
}

export interface AppState {
    columnDefs?: ColDef[];
    rowData?: any[];
}

class App extends React.Component<AppProps, AppState> {
    gridApi!: GridApi;

    constructor(props: AppProps) {
        super(props);
        this.state = {
            columnDefs: [{
                headerName: "Make", field: "make", sortable: true, filter: true, checkboxSelection: true
            }, {
                headerName: "Model", field: "model", sortable: true, filter: true
            }, {
                headerName: "Price", field: "price", sortable: true, filter: true
            }]
        }
    }

    componentDidMount(): void {
        fetch('https://api.myjson.com/bins/15psn9')
            .then(result => result.json())
            .then(rowData => this.setState({rowData}));
    }

    render() {
        return (
            <div className="ag-theme-balham-dark" style={{height: '500px', width: '600px'}}>
                <button onClick={this.onButtonClick}>Get selected rows</button>
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    rowSelection="multiple"
                    onGridReady={(params) => this.gridApi = params.api}>
                </AgGridReact>
            </div>
        );
    }

    onButtonClick = (e: MouseEvent) => {
        let selectedNodes = this.gridApi.getSelectedNodes();
        let selectedData = selectedNodes.map(node => node.data);
        let selectedDataString = selectedData.map(node => node.make + ' ' + node.model).join(', ');
        alert(`Selected nodes: ${selectedDataString}`);
    }
}

export default App;
