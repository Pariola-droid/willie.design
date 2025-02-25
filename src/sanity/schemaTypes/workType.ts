import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const workType = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
      title: 'Feature this project',
      options: {
        layout: 'switch',
      },
    }),
    defineField({
      name: 'layout',
      type: 'string',
      placeholder: 'Select layout',
      initialValue: 'layout_a',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Primary', value: 'layout_a' },
          { title: 'Secondary', value: 'layout_b' },
        ],
      },
    }),
    defineField({
      name: 'title',
      type: 'string',
      placeholder: 'Project title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'captions',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'liveLink',
      type: 'url',
      title: 'Live link',
    }),
    defineField({
      name: 'caseStudyImages',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }),
            defineField({
              name: 'position',
              type: 'string',
              placeholder: 'Select position',
              validation: (Rule) => Rule.required(),
              options: {
                list: [
                  { title: 'Position one', value: 'position_1' },
                  { title: 'Position two', value: 'position_2' },
                  { title: 'Position three', value: 'position_3' },
                  { title: 'Position four', value: 'position_4' },
                ],
              },
            }),
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'collab',
      type: 'string',
      placeholder: 'Collaborators',
    }),
    defineField({
      name: 'accolades',
      type: 'string',
      placeholder: 'Awards & accolades',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
    },
    prepare(selection) {
      return { ...selection, subtitle: 'Work' };
    },
  },
});
