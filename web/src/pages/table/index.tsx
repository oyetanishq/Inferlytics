import { ListTable } from "./list-table";
import { ViewTable } from "./view-table";
import { CreateTable } from "./create-table";

import { useTableStore } from "@/store/table";

export default function Table() {
    const { setMobileMenuOpen } = useTableStore();

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Mobile header */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-900">Database Tables</h1>
                    <button onClick={() => setMobileMenuOpen(true)} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Tables
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - hidden on mobile, shown in modal */}
                <ListTable className="hidden lg:block w-80 flex-shrink-0" />

                {/* Mobile sidebar - shown as bottom sheet */}
                <ListTable className="lg:hidden" />

                {/* Main content area */}
                <ViewTable />

                {/* Create table modal */}
                <CreateTable />
            </div>
        </div>
    );
}
