export type TBoldBlock = {
  id: string;
  type: 'bold' | 'paragraph';
  data: {
    children: Array<TInlineBlock>;
  };
};

export type TQuoteBlock = {
  id: string;
  type: 'quote';
  data: {
    children: Array<TInlineBlock>;
    caption: string;
  };
};

export type THeaderBlock = {
  id: string;
  type: 'header';
  data: {
    children: Array<TInlineBlock>;
    level: number;
  };
};

export type TUnorderedListBlock = {
  id: string;
  type: 'list';
  data: {
    style: 'unordered';
    children: Array<TInlineBlock>;
  };
};

export type TOrderedListBlock = {
  id: string;
  type: 'list';
  data: {
    style: 'ordered';
    children: Array<TInlineBlock>;
  };
};

export type TTextBlock = {
  id: '';
  type: 'text';
  data: {
    value: string;
  };
};

export type TImageBlock = {
  id: string;
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

type CustomBlockLetter =
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
  | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
  | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
  | '_' | '-';

type CustomBlockLetterString = `${CustomBlockLetter}${CustomBlockLetterString}` | `${CustomBlockLetter}`;

export type TCustomBlock = {
  id: string;
  type: `$custom/${CustomBlockLetterString}`;
  data?: unknown;
};

export type TNewlineBlock = {
  id: string;
  type: 'newline';
};

export type TItalicBlock = {
  id: string;
  type: 'italic';
  data: {
    children: Array<TInlineBlock>;
  };
};

export type TAnchorBlock = {
  id: string;
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
