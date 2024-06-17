import { create } from 'zustand'
// import { devtools } from 'zustand/middleware'



 export const useUserSupportStore = create(((set)=>({
    user:{},
    asignedNodeList:[],
    setUser: (userData) => set({ user: userData }),
    addAssignedNode: (newNode) => set((state) => ({ asignedNodeList: [...state.asignedNodeList, newNode] })),
    removeAssignedNode: (value) => set((state) => ({ 
        asignedNodeList: state.asignedNodeList.filter(node => node.value !== value)
    })),
    clearState: () => set({ user: {}, asignedNodeList: [] })
})))



