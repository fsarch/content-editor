import React from 'react';
import { BlockManager, registerDefaultInlineBlocks, registerDefaultSectionBlocks, ContentEditor, TContentValue } from "@fsarch/content-editor";

type BrowserOnlyEditorProps = {
  onChange: (val: TContentValue) => void;
  value: TContentValue | null;
};


const BLOCK_MANAGER_INSTANCE = new BlockManager();

registerDefaultSectionBlocks(BLOCK_MANAGER_INSTANCE.section);
registerDefaultInlineBlocks(BLOCK_MANAGER_INSTANCE.inline);

const BrowserOnlyEditor: React.FunctionComponent<BrowserOnlyEditorProps> = ({
  onChange,
  value,
}) => {
  return (
    <ContentEditor
      blockManager={BLOCK_MANAGER_INSTANCE}
      onChange={onChange}
      value={value ?? undefined}
    />
  );
};

export default BrowserOnlyEditor;
