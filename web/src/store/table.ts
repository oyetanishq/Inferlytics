import { create } from "zustand";

export interface Column {
    id: string;
    name: string;
    type: "int8" | "float8" | "date" | "time" | "timestamp" | "boolean" | "uuid" | "text";
    defaultValue: number | string | null;
}

export interface Table {
    id: string;
    name: string;
    columns: Column[];
    data: Record<string, any>[];
}

interface TableStore {
    tables: Table[];
    selectedTableId: string | null;
    isCreateTableOpen: boolean;
    isMobileMenuOpen: boolean;
    addTable: (table: Omit<Table, "id" | "createdAt">) => void;
    selectTable: (id: string) => void;
    setCreateTableOpen: (open: boolean) => void;
    setMobileMenuOpen: (open: boolean) => void;
    deleteTable: (id: string) => void;
    updateTableData: (tableId: string, rowIndex: number, columnName: string, value: any) => void;
    addRow: (tableId: string, rowData: Record<string, any>) => void;
    addColumn: (tableId: string, column: Column) => void;
    importFromCSV: (tableId: string, csvData: string) => void;
}

export const useTableStore = create<TableStore>()((set, get) => ({
    tables: [],
    selectedTableId: null,
    isCreateTableOpen: false,
    isMobileMenuOpen: false,
    addTable: (tableData) => {
        const newTable: Table = {
            ...tableData,
            id: crypto.randomUUID(),
        };
        set((state) => ({
            tables: [...state.tables, newTable],
            selectedTableId: newTable.id,
            isCreateTableOpen: false,
        }));
    },
    selectTable: (id) => set({ selectedTableId: id, isMobileMenuOpen: false }),
    setCreateTableOpen: (open) => set({ isCreateTableOpen: open }),
    setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    deleteTable: (id) => {
        const state = get();
        const newTables = state.tables.filter((table) => table.id !== id);
        set({
            tables: newTables,
            selectedTableId: state.selectedTableId === id ? null : state.selectedTableId,
        });
    },
    updateTableData: (tableId, rowIndex, columnName, value) => {
        set((state) => ({
            tables: state.tables.map((table) =>
                table.id === tableId
                    ? {
                          ...table,
                          data: table.data.map((row, index) => (index === rowIndex ? { ...row, [columnName]: value } : row)),
                      }
                    : table
            ),
        }));
    },
    addRow: (tableId, rowData) => {
        set((state) => ({
            tables: state.tables.map((table) => (table.id === tableId ? { ...table, data: [...table.data, rowData] } : table)),
        }));
    },
    addColumn: (tableId, column) => {
        set((state) => ({
            tables: state.tables.map((table) =>
                table.id === tableId
                    ? {
                          ...table,
                          columns: [...table.columns, column],
                          data: table.data.map((row) => ({
                              ...row,
                              [column.name]: column.defaultValue,
                          })),
                      }
                    : table
            ),
        }));
    },
    importFromCSV: (tableId, csvData) => {
        const lines = csvData.trim().split("\n");
        if (lines.length < 2) return;

        const headers = lines[0].split(",").map((h) => h.trim());
        const rows = lines.slice(1).map((line) => {
            const values = line.split(",").map((v) => v.trim());
            const rowData: Record<string, any> = {};
            headers.forEach((header, index) => {
                rowData[header] = values[index] || null;
            });
            return rowData;
        });

        set((state) => ({
            tables: state.tables.map((table) => (table.id === tableId ? { ...table, data: [...table.data, ...rows] } : table)),
        }));
    },
}));
