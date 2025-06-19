import { useState } from "react";
import { useTableStore } from "@/store/table";
import { X } from "lucide-react";

export const CreateTable = () => {
    const { isCreateTableOpen, setCreateTableOpen, addTable } = useTableStore();
    const [tableName, setTableName] = useState("");
    const [columns, setColumns] = useState([{ id: crypto.randomUUID(), name: "", type: "text" as const, defaultValue: null as string | null }]);

    const columnTypes = ["int8", "float8", "date", "time", "timestamp", "boolean", "uuid", "text"] as const;

    const addColumn = () => {
        setColumns([
            ...columns,
            {
                id: crypto.randomUUID(),
                name: "",
                type: "text",
                defaultValue: null,
            },
        ]);
    };

    const updateColumn = (id: string, field: string, value: any) => {
        setColumns(columns.map((col) => (col.id === id ? { ...col, [field]: value } : col)));
    };

    const removeColumn = (id: string) => {
        if (columns.length > 1) {
            setColumns(columns.filter((col) => col.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tableName.trim() && columns.every((col) => col.name.trim())) {
            addTable({
                name: tableName.trim(),
                columns: columns.map((col) => ({
                    ...col,
                    name: col.name.trim(),
                })),
                data: [], // Add the missing data property
            });
            setTableName("");
            setColumns([{ id: crypto.randomUUID(), name: "", type: "text", defaultValue: null }]);
        }
    };

    const handleCancel = () => {
        setCreateTableOpen(false);
        setTableName("");
        setColumns([{ id: crypto.randomUUID(), name: "", type: "text", defaultValue: null }]);
    };

    if (!isCreateTableOpen) return null;

    return (
        <div className="absolute right-0 top-0 w-full h-full backdrop-blur-[1px] duration-300 flex items-center justify-end z-50">
            <div className="bg-white shadow-xl w-full h-full max-h-dvh max-w-2xl overflow-hidden border-l border-gray-200 flex flex-col justify-start items-center">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 w-full">
                    <h2 className="text-xl font-semibold text-gray-900">Create New Table</h2>
                    <button onClick={handleCancel} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-scroll w-full flex flex-col justify-start items-center">
                    <div className="mb-6 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Table Name</label>
                        <input
                            type="text"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter table name"
                            required
                        />
                    </div>

                    <div className="mb-6 w-full flex-1 flex flex-col justify-start items-center">
                        <div className="flex items-center justify-between mb-4 w-full">
                            <label className="block text-sm font-medium text-gray-700">Columns</label>
                            <button type="button" onClick={addColumn} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Add Column
                            </button>
                        </div>

                        <div className="space-y-3 flex-1 overflow-scroll w-full">
                            {columns.map((column, _) => (
                                <div key={column.id} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={column.name}
                                            onChange={(e) => updateColumn(column.id, "name", e.target.value)}
                                            className="min-w-28 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Column name"
                                            required
                                        />
                                    </div>
                                    <div className="w-32">
                                        <select
                                            value={column.type}
                                            onChange={(e) => updateColumn(column.id, "type", e.target.value)}
                                            className="min-w-24 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {columnTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-32">
                                        <input
                                            type="text"
                                            value={column.defaultValue || ""}
                                            onChange={(e) => updateColumn(column.id, "defaultValue", e.target.value || null)}
                                            className="min-w-28 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Default value"
                                        />
                                    </div>
                                    {columns.length > 1 && (
                                        <button type="button" onClick={() => removeColumn(column.id)} className="p-1 text-red-500 hover:text-red-700">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end w-full">
                        <button type="button" onClick={handleCancel} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                            Create Table
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
