import { useState } from "react";
import { useTableStore } from "@/store/table";
import { ChevronDown, Plus } from "lucide-react";

export const ViewTable = () => {
    const { tables, selectedTableId, updateTableData, addRow, addColumn, importFromCSV } = useTableStore();
    const [editingCell, setEditingCell] = useState<{ row: number; column: string } | null>(null);
    const [editValue, setEditValue] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const selectedTable = tables.find((table) => table.id === selectedTableId);

    if (!selectedTable) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5v0a2 2 0 002 2h4a2 2 0 002-2v0" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No table selected</h3>
                    <p className="text-gray-500">Select a table from the sidebar to view its structure and data</p>
                </div>
            </div>
        );
    }

    const handleCellDoubleClick = (rowIndex: number, columnName: string, currentValue: any) => {
        setEditingCell({ row: rowIndex, column: columnName });
        setEditValue(currentValue?.toString() || "");
    };

    const handleCellUpdate = () => {
        if (editingCell) {
            updateTableData(selectedTableId!, editingCell.row, editingCell.column, editValue);
            setEditingCell(null);
            setEditValue("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCellUpdate();
        } else if (e.key === "Escape") {
            setEditingCell(null);
            setEditValue("");
        }
    };

    const handleAddRow = () => {
        const newRow: Record<string, any> = {};
        selectedTable.columns.forEach((column) => {
            newRow[column.name] = column.defaultValue || null;
        });
        addRow(selectedTableId!, newRow);
        setDropdownOpen(false);
    };

    const handleAddColumn = () => {
        const columnName = prompt("Enter column name:");
        const columnType = prompt("Enter column type (int8, float8, date, time, timestamp, boolean, uuid, text):") as any;

        if (columnName && columnType) {
            addColumn(selectedTableId!, {
                id: crypto.randomUUID(),
                name: columnName,
                type: columnType,
                defaultValue: null,
            });
        }
        setDropdownOpen(false);
    };

    const handleImportCSV = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const csv = e.target?.result as string;
                    importFromCSV(selectedTableId!, csv);
                };
                reader.readAsText(file);
            }
        };
        input.click();
        setDropdownOpen(false);
    };

    const typeColors = {
        int8: "bg-blue-100 text-blue-800",
        float8: "bg-green-100 text-green-800",
        date: "bg-purple-100 text-purple-800",
        time: "bg-indigo-100 text-indigo-800",
        timestamp: "bg-pink-100 text-pink-800",
        boolean: "bg-yellow-100 text-yellow-800",
        uuid: "bg-gray-100 text-gray-800",
        text: "bg-orange-100 text-orange-800",
    };

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">{selectedTable.name}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedTable.columns.length} columns • {selectedTable.data.length} rows
                        </p>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={16} />
                            Insert
                            <ChevronDown size={16} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <button onClick={handleAddRow} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">
                                    Insert Row
                                </button>
                                <button onClick={handleAddColumn} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">
                                    Insert Column
                                </button>
                                <button onClick={handleImportCSV} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">
                                    Import from CSV
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Data - Excel-like */}
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="w-12 px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">#</th>
                                        {selectedTable.columns.map((column) => (
                                            <th
                                                key={column.id}
                                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[120px]"
                                            >
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-gray-900">{column.name}</div>
                                                    <div>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${typeColors[column.type]}`}>{column.type}</span>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedTable.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={selectedTable.columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                                                No data in this table yet. Click "Insert Row" to add data.
                                            </td>
                                        </tr>
                                    ) : (
                                        selectedTable.data.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 text-sm text-gray-500 border-r border-gray-200 bg-gray-50 font-medium">{rowIndex + 1}</td>
                                                {selectedTable.columns.map((column) => (
                                                    <td
                                                        key={column.id}
                                                        className="px-4 py-2 border-r border-gray-200 cursor-pointer hover:bg-blue-50"
                                                        onDoubleClick={() => handleCellDoubleClick(rowIndex, column.name, row[column.name])}
                                                    >
                                                        {editingCell?.row === rowIndex && editingCell?.column === column.name ? (
                                                            <input
                                                                type="text"
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                onBlur={handleCellUpdate}
                                                                onKeyDown={handleKeyPress}
                                                                className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <div className="text-sm text-gray-900 min-h-[20px]">
                                                                {row[column.name] !== null && row[column.name] !== undefined ? (
                                                                    row[column.name].toString()
                                                                ) : (
                                                                    <span className="text-gray-400">NULL</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
        </div>
    );
};
