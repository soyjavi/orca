import { C } from './constants';

export const getSymbol = (key) => C.SYMBOL[key] || key;
