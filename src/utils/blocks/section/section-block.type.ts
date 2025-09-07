import { TInlineBlock, TTextBlock } from "../../html.type";

export type TParagraphBlock = {
  id: string;
  type: 'paragraph';
  data: {
    children: Array<TInlineBlock>;
  };
};

export type TListBlockChildren = {
  content: Array<TInlineBlock>;
  childList?: TListBlock;
};

export type TListBlock = {
  id: string;
  type: 'list';
  data: {
    style: 'unordered' | 'ordered';
    children: Array<TListBlockChildren>;
  };
}

export type THeadlineSection = {
  id: string;
  type: 'headline';
  data: {
    children: Array<TTextBlock>;
    level: number;
  };
};

export type TSectionBlock = TParagraphBlock | TListBlock | THeadlineSection;
