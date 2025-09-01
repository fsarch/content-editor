import { TInlineBlock } from "./html.type";

export type TBlock = {
  id: string;
  type: 'paragraph';
  data: {
    text: Array<TInlineBlock>;
  };
};

export type TBaseBlock = {
  id: string;
  type: string;
  data?: unknown;
};
