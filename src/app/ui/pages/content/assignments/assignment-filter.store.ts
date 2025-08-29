import { create } from 'zustand';
import type { Assignment } from "@/app/api/services/assignments"; // Make sure this path is correct

// Define the shape of the filter object. Use a specific type for better safety.
// This can be a subset of the Assignment type.
type AssignmentFilterState = Partial<Pick<Assignment, 'levelId' | 'subjectId' | 'title' | 'state'>> & {
    page?: number;
    pageSize?: number;
};

// Define the store's state and actions
interface AssignmentFilterStore {
    filters: AssignmentFilterState;
    setFilters: (newFilters: AssignmentFilterState) => void;
    updateFilter: (filterUpdate: Partial<AssignmentFilterState>) => void;
    clearFilters: () => void;
}

// Create the store
export const useAssignmentFilterStore = create<AssignmentFilterStore>((set) => ({
    // Initial state
    filters: {
        page: 1,
        pageSize: 10,
    },

    // Action to completely replace the filters
    setFilters: (newFilters) => set({ filters: newFilters }),

    // Action to merge in new filter values (e.g., when paginating)
    updateFilter: (filterUpdate) => 
        set((state) => ({ 
            filters: { ...state.filters, ...filterUpdate } 
        })),

    // Action to reset filters to their initial state
    clearFilters: () => 
        set({ 
            filters: { page: 1, pageSize: 10 } 
        }),
}));