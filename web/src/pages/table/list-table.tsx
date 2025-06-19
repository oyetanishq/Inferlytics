import { useTableStore } from "@/store/table";
import { Plus, X } from "lucide-react";

interface ListTableProps {
    className?: string;
}

export const ListTable = ({ className = "" }: ListTableProps) => {
    const { tables, selectedTableId, selectTable, setCreateTableOpen, isMobileMenuOpen, setMobileMenuOpen } = useTableStore();

    return (
        <>
            {/* Mobile overlay */}
            {isMobileMenuOpen && <div className="fixed inset-0 backdrop-blur-[1px] duration-300 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}

            {/* Sidebar */}
            <div
                className={`
                    ${className}
                    ${isMobileMenuOpen ? "translate-y-0" : "translate-y-full"}
                    lg:translate-y-0
                    fixed bottom-0 left-0 right-0 
                    lg:relative lg:bottom-auto lg:left-auto lg:right-auto
                    bg-white border-r border-gray-200 
                    transition-transform duration-300 ease-in-out
                    z-50 lg:z-auto
                    max-h-[70vh] lg:max-h-none
                    rounded-t-xl lg:rounded-none
                    border-t 
                `}
            >
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Tables</h2>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                {/* Desktop header */}
                <div className="hidden lg:block p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Tables</h2>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        <button
                            onClick={() => setCreateTableOpen(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            New Table
                        </button>
                    </div>

                    <div className="px-4 pb-4 space-y-1">
                        {tables.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No tables yet</p>
                                <p className="text-xs mt-1">Create your first table to get started</p>
                            </div>
                        ) : (
                            tables.map((table) => (
                                <button
                                    key={table.id}
                                    onClick={() => selectTable(table.id)}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                                        ${selectedTableId === table.id ? "bg-blue-100 text-blue-900 border border-blue-200" : "text-gray-700 hover:bg-gray-100"}
                                    `}
                                >
                                    <div className="font-medium">{table.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{table.columns.length} columns</div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
