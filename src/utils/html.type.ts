export type TBoldBlock = {
  type: 'bold' | 'paragraph';
  data: {
    children: Array<TInlineBlock>;
  };
};

export type TQuoteBlock = {
  type: 'quote';
  data: {
    children: Array<TInlineBlock>;
    caption: string;
  };
};

export type THeaderBlock = {
  type: 'header';
  data: {
    children: Array<TInlineBlock>;
    level: number;
  };
};

export type TUnorderedListBlock = {
  type: 'list';
  data: {
    style: 'unordered';
    children: Array<TInlineBlock>;
  };
};

export type TOrderedListBlock = {
  type: 'list';
  data: {
    style: 'ordered';
    children: Array<TInlineBlock>;
  };
};

export type TTextBlock = {
  type: 'text';
  data: {
    value: string;
  };
};

export type TImageBlock = {
  type: 'image';
  data: {
    file: {
      url: string;
    };
    caption: string;
    withBorder: boolean;
    stretched: boolean;
    withBackground: boolean;
  };
};

export type TCustomBlock = {
  type: 'custom';
};

export type TNewlineBlock = {
  type: 'newline';
};

export type TItalicBlock = {
  type: 'italic';
  data: {
    children: Array<TInlineBlock>;
  };
};

export type TAnchorBlock = {
  type: 'anchor';
  data: {
    href: string;
    children: Array<TInlineBlock>;
  };
};

export type TInlineBlock =
  | TBoldBlock
  | TItalicBlock
  | TQuoteBlock
  | THeaderBlock
  | TUnorderedListBlock
  | TOrderedListBlock
  | TTextBlock
  | TImageBlock
  | TCustomBlock
  | TNewlineBlock
  | TAnchorBlock;
