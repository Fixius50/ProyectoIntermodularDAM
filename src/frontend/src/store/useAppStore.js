import { create } from 'zustand';

export const useAppStore = create((set) => ({
    inventory: {
        mana: 150,
        documents: 12,
        wood: 5,
        fruit: 3
    },
    weather: {
        city: 'Madrid',
        condition: 'Despejado',
        tempC: 18
    },

    // Acciones (Ejemplos para usar más adelante)
    addMana: (amount) => set((state) => ({
        inventory: { ...state.inventory, mana: state.inventory.mana + amount }
    })),

    spendMana: (amount) => set((state) => ({
        inventory: { ...state.inventory, mana: Math.max(0, state.inventory.mana - amount) }
    })),
}));
