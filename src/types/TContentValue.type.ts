import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";

export type TContentValue = {
  meta: {
    version?: string;
    timestamp?: number;
  };
  blocks: OutputData['blocks'];
};
