import type { TInlineBlock } from "../../html.type";

export type TParagraphBlock = {
  id: string;
  type: 'paragraph';
  data: {
    children: Array<TInlineBlock>;
  };
};

export type TSectionBlock = TParagraphBlock;
