import { SectionBlockMapperBuilder } from "./SectionBlockMapperBuilder";
import { THeadlineSection } from "./section-block.type";

export const HeadlineSection = new SectionBlockMapperBuilder<THeadlineSection>('headline')
  .fromEditorJs((block) => {
    const id = block.id ?? '';

    console.log('block', block);

    return {
      id,
      type: 'headline',
      data: {
        children: [{
          id: '',
          type: 'text',
          data: {
            value: block.data.text,
          },
        }],
        level: block.data.level || 1,
      },
    };
  })
  .toEditorJs((block) => {
    return {
      id: block.id,
      type: 'headline',
      data: {
        text: block.data.children[0].data.value,
        level: block.data.level,
      },
    }
  })
  .build();
