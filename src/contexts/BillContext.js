import React, { createContext, useContext, useReducer } from 'react';

const BillContext = createContext();

const initialState = {
  bills: [],
  currentBill: null,
  loading: false,
  error: null,
};

function billReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_BILLS':
      return { ...state, bills: action.payload };
    case 'SET_CURRENT_BILL':
      return { ...state, currentBill: action.payload };
    case 'ADD_BILL':
      return { ...state, bills: [action.payload, ...state.bills] };
    case 'UPDATE_BILL':
      return {
        ...state,
        bills: state.bills.map(bill => 
          bill.id === action.payload.id ? action.payload : bill
        ),
        currentBill: state.currentBill?.id === action.payload.id 
          ? { ...state.currentBill, ...action.payload }
          : state.currentBill
      };
    case 'DELETE_BILL':
      return {
        ...state,
        bills: state.bills.filter(bill => bill.id !== action.payload),
        currentBill: state.currentBill?.id === action.payload ? null : state.currentBill
      };
    case 'ADD_PRODUCT':
      if (state.currentBill) {
        return {
          ...state,
          currentBill: {
            ...state.currentBill,
            products: [...state.currentBill.products, action.payload]
          }
        };
      }
      return state;
    case 'UPDATE_PRODUCT':
      if (state.currentBill) {
        return {
          ...state,
          currentBill: {
            ...state.currentBill,
            products: state.currentBill.products.map(product =>
              product.id === action.payload.id ? action.payload : product
            )
          }
        };
      }
      return state;
    case 'DELETE_PRODUCT':
      if (state.currentBill) {
        return {
          ...state,
          currentBill: {
            ...state.currentBill,
            products: state.currentBill.products.filter(product => product.id !== action.payload)
          }
        };
      }
      return state;
    default:
      return state;
  }
}

export function BillProvider({ children }) {
  const [state, dispatch] = useReducer(billReducer, initialState);

  return (
    <BillContext.Provider value={{ state, dispatch }}>
      {children}
    </BillContext.Provider>
  );
}

export function useBill() {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
} 