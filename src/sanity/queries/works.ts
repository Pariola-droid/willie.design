import { groq } from 'next-sanity';

export const WORKS_QUERY = groq`*[_type == "work" && defined(slug.current)] | order(publishedAt desc){
    _id,
    hoverColor,
    title,
    slug,
    coverImage{
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt
    },
    description,
    publishedAt,
    caseStudyImages[]{
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt,
        position
    },
  }`;

export const WORK_QUERY = groq`*[_type == "work" && slug.current == $slug][0]{
    _id,
    layout,
    slug,
    title,
    captions,
    coverImage{
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt
    },
    description,
    caseStudyImages[]{
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt,
        position
    },
    liveLink,
    collabs,
    accolades,
    publishedAt,
    _createdAt,
    _updatedAt,
    meta_title,
    meta_description,
    noindex,
    ogImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
    }
  }`;

export const WORKS_SLUGS_QUERY = groq`*[_type == "work" && defined(slug.current)]{
    "slug": slug.current
  }`;
