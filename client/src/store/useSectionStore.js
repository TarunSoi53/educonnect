import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSectionStore = create(
  persist(
    (set) => ({
      sections: [],
      selectedSection: null,
      setSections: (sections) => set({ sections }),
      setSelectedSection: (section) => set({ selectedSection: section }),
      addSection: (section) => 
        set((state) => ({ 
          sections: [...state.sections, section] 
        })),
      updateSection: (sectionId, updatedSection) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section._id === sectionId ? updatedSection : section
          ),
        })),
      deleteSection: (sectionId) =>
        set((state) => ({
          sections: state.sections.filter((section) => section._id !== sectionId),
        })),
    }),
    {
      name: 'section-storage',
    }
  )
);

export default useSectionStore; 