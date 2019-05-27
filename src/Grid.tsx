import * as React from 'react';
import './App.css';
import {AgGridReact, AgGridReactProps} from 'ag-grid-react';
import {ColDef, GridApi, IDatasource, IGetRowsParams} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import {LoadingCellRenderer} from "ag-grid-community/dist/lib/rendering/cellRenderers/loadingCellRenderer";

export interface AppState {
    defaultColDef?: ColDef;
    columnDefs?: ColDef[];
}

class Grid extends React.Component<AgGridReactProps, AppState> {
    rowId: string;
    apiKey!: string;
    gridApi!: GridApi;
    dataSource!: IDatasource;

    constructor(props: AgGridReactProps) {
        super(props);
        this.state = {
            defaultColDef: {
                width: 150,
                checkboxSelection: (params) => {
                    let displayedColumns = params.columnApi.getAllDisplayedColumns();
                    return displayedColumns[0] === params.column;
                }
            },
            columnDefs: []
        };
        this.rowId = "field0";
        this.dataSource = {
            getRows: async (params: IGetRowsParams): Promise<void> => {
                let response = await fetch('https://www.quandl.com/api/v3/datasets/UMICH/SOC46?api_key=' + this.apiKey);
                let jsonData = await response.json();
                let {data} = jsonData.dataset;
                let {startRow, endRow} = params;
                let rowsThisPage = data.slice(startRow, endRow);
                let rowData: any[] = rowsThisPage.map((row: string[]) => {
                    let rowObj: any = {};
                    row.forEach((value: string, index: number) => {
                        rowObj[`field${index}`] = value;
                    });
                    return rowObj;
                });
                let lastRow = -1;
                if (data.length <= endRow) {
                    lastRow = data.length;
                }
                params.successCallback(rowData, lastRow);
            }
        };
    }

    render() {
        return (
            <div className="Grid ag-theme-balham-dark" style={{height: '100%', width: '100%'}}>
                <button onClick={this.onButtonClick}>Get selected rows</button>
                <AgGridReact
                    defaultColDef={this.state.defaultColDef}
                    columnDefs={this.state.columnDefs}
                    getRowNodeId={this.getRowNodeId}
                    datasource={this.dataSource}
                    rowModelType="infinite"
                    rowSelection="multiple"
                    loadingCellRenderer={LoadingCellRenderer}
                    animateRows={true}
                    deltaRowDataMode
                    onGridReady={(params) => this.gridApi = params.api}>
                </AgGridReact>
            </div>
        );
    }

    componentDidMount(): void {
        fetch('https://www.quandl.com/api/v3/datasets/UMICH/SOC46/metadata.json?api_key=' + this.apiKey)
            .then(result => result.json())
            .then(jsonData => {
                let {column_names: columnNames} = jsonData.dataset;
                let columnDefs = columnNames.map((columnName: string, index: number) => {
                    let colDef: ColDef = {
                        headerName: columnName,
                        field: "field" + index,
                    };
                    return colDef;
                });
                this.setState({columnDefs: columnDefs});
            })
    }

    onButtonClick = () => {
        let selectedNodes = this.gridApi.getSelectedNodes();
        let selectedData = selectedNodes.map(node => node.data);
        let selectedDataString = selectedData.map(node => node[this.rowId]).join(', ');
        alert(`Selected nodes: ${selectedDataString}`);
    };

    getRowNodeId = (data: any) => {
        return data && data[this.rowId];
    };
}

export default Grid;
