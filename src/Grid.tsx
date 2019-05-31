import * as React from 'react';
import './App.css';
import {AgGridReact, AgGridReactProps} from 'ag-grid-react';
import {CellValueChangedEvent, ColDef, GetMainMenuItemsParams, GridApi} from 'ag-grid-community';
import {LicenseManager} from "ag-grid-enterprise";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export interface GridState {
    rowData?: any[];
    defaultColDef?: ColDef;
    columnDefs?: ColDef[];
}

class Grid extends React.Component<AgGridReactProps, GridState> {
    rowId: string;
    apiKey!: string;
    gridApi!: GridApi;

    constructor(props: AgGridReactProps) {
        super(props);
        LicenseManager.setLicenseKey("Peace_OTY2OTQ1OTQ1Njk3Mw==7e213e88aef89910e528cf77b5ac1af0");
        this.state = {
            defaultColDef: {
                width: 150,
                editable: true,
                menuTabs: ['generalMenuTab', 'filterMenuTab'],
                checkboxSelection: (params) => {
                    let displayedColumns = params.columnApi.getAllDisplayedColumns();
                    return displayedColumns[0] === params.column;
                },
                filter: true,
                sortable: true,
                enablePivot: true,
                enableValue: true,
                enableRowGroup: true,
                resizable: true
            },
            columnDefs: []
        };
        this.rowId = "field0";
        this.apiKey = "N3ct2xmC4dg-bEpGhDp1";
    }

    render() {
        return (
            <div className="Grid ag-theme-balham" style={{height: '100%', width: '100%'}}>
                <button onClick={this.buttonClickHandler}>Get selected rows</button>
                <AgGridReact
                    rowSelection="multiple"
                    sideBar={true}
                    animateRows={true}
                    deltaRowDataMode
                    reactNext={true}
                    defaultColDef={this.state.defaultColDef}
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    getRowNodeId={this.getRowNodeId}
                    onGridReady={(params) => this.gridApi = params.api}
                    onCellValueChanged={this.cellValueChangedHandler}
                    getMainMenuItems={this.getMainMenuItems}>
                </AgGridReact>
            </div>
        );
    }

    componentDidMount(): void {
        fetch('https://www.quandl.com/api/v3/datasets/UMICH/SOC46?api_key=' + this.apiKey)
            .then(result => result.json())
            .then(jsonData => {
                let {column_names: columnNames, data} = jsonData.dataset;
                let columnDefs = columnNames.map((columnName: string, index: number) => {
                    let colDef: ColDef = {
                        headerName: columnName,
                        field: "field" + index,
                    };
                    return colDef;
                });
                let rowData: any[] = data.map((row: string[]) => {
                    let rowObj: any = {};
                    row.forEach((value: string, index: number) => {
                        rowObj[`field${index}`] = value;
                    });
                    return rowObj;
                });
                this.setState({columnDefs: columnDefs, rowData: rowData});
            })
    }

    buttonClickHandler = () => {
        let selectedNodes = this.gridApi.getSelectedNodes();
        let selectedData = selectedNodes.map(node => node.data);
        let selectedDataString = selectedData.map(node => node[this.rowId]).join(', ');
        alert(`Selected nodes: ${selectedDataString}`);
    };

    cellValueChangedHandler = (event: CellValueChangedEvent) => {
        console.log(event.data);
    };

    getRowNodeId = (data: any) => {
        return data && data[this.rowId];
    };

    getMainMenuItems = (params: GetMainMenuItemsParams) => {
        return ['pinSubMenu', 'separator', 'autoSizeThis', 'autoSizeAll', 'separator', 'rowGroup', 'rowUnGroup'];
    }
}

export default Grid;
