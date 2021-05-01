import { C } from './constants';

export const getSymbol = (key = C.DEFAULT_SYMBOL) => C.SYMBOL[key] || key;
