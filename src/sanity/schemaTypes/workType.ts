import { isUniqueAcrossAllDocuments } from '@/lib/sanity';
import { DocumentTextIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const workType = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
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
      name: 'ogImage',
      title: 'Open Graph Image - [1200x630]',
      type: 'image',
      group: 'seo',
    }),
    defineField({
      name: 'meta_title',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'meta_description',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
    }),
    defineField({
      name: 'noindex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),
    defineField({
      name: 'layout',
      type: 'string',
      placeholder: 'Select layout',
      initialValue: 'layout_a',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Primary', value: 'layout_p' },
          { title: 'Secondary', value: 'layout_s' },
        ],
      },
      group: 'content',
    }),
    defineField({
      name: 'hoverColor',
      type: 'string',
      title: 'Hover color',
      group: 'content',
    }),
    defineField({
      name: 'title',
      type: 'string',
      placeholder: 'Project title',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        isUnique: isUniqueAcrossAllDocuments,
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
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
      group: 'content',
    }),
    defineField({
      name: 'captions',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      group: 'content',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'liveLink',
      type: 'url',
      title: 'Live link',
      group: 'content',
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
      validation: (Rule) => Rule.required().max(4),
      group: 'content',
    }),
    defineField({
      name: 'collabs',
      type: 'array',
      of: [
        {
          type: 'string',
          title: 'Collaborator',
          placeholder: 'Collaborator name',
        },
      ],
      options: {
        layout: 'list',
      },
      group: 'content',
    }),
    defineField({
      name: 'accolades',
      type: 'array',
      of: [
        {
          type: 'string',
          title: 'Awards & accolades',
          placeholder: 'Award or accolade',
        },
      ],
      options: {
        layout: 'list',
      },
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      layout: 'layout',
      media: 'coverImage',
    },
    prepare(selection) {
      return { ...selection, subtitle: 'Work' };
    },
  },
});
