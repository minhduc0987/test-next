export interface IAppState {
  payload: {
    text: string,
    minPrice: string,
    maxPrice: string,
  };
}

const initialState: IAppState = {
  payload: {
    text: '',
    minPrice: '',
    maxPrice: '',
  },
};

const app = (state = initialState, action: any) => {
  switch (action.type) {
    case 'setText':
      return {
        ...state,
        payload: {
          ...state.payload,
          text: action.payload.text,
        },
      };
    case 'setMinPrice':
      return {
        ...state,
        payload: {
          ...state.payload,
          minPrice: action.payload.minPrice,
        },
      };
    case 'setMaxPrice':
      return {
        ...state,
        payload: {
          ...state.payload,
          maxPrice: action.payload.maxPrice,
        },
      };
    default:
      return state;
  }
};

export default app;
