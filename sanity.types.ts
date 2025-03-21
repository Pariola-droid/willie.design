/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Work = {
  _id: string;
  _type: "work";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  featured?: boolean;
  ogImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  meta_title?: string;
  meta_description?: string;
  noindex?: boolean;
  layout?: "layout_p" | "layout_s";
  hoverColor?: string;
  title?: string;
  slug?: Slug;
  coverImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
  };
  captions?: Array<string>;
  description?: string;
  liveLink?: string;
  caseStudyImages?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    position?: "position_1" | "position_2" | "position_3" | "position_4";
    _type: "image";
    _key: string;
  }>;
  collabs?: Array<string>;
  accolades?: Array<string>;
  publishedAt?: string;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type AllSanitySchemaTypes = SanityImagePaletteSwatch | SanityImagePalette | SanityImageDimensions | SanityFileAsset | Geopoint | Work | Slug | SanityImageCrop | SanityImageHotspot | SanityImageAsset | SanityAssetSourceData | SanityImageMetadata;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ./src/sanity/queries/works.ts
// Variable: WORKS_QUERY
// Query: *[_type == "work" && defined(slug.current)] | order(publishedAt desc){    _id,    hoverColor,    title,    slug,    "coverImageUrl": coverImage.asset->url,    "coverImageAlt": coverImage.alt,    description,    publishedAt,    "caseStudyImages": caseStudyImages[]{      "url": asset->url,      "alt": alt,      "position": position    }  }
export type WORKS_QUERYResult = Array<{
  _id: string;
  hoverColor: string | null;
  title: string | null;
  slug: Slug | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  description: string | null;
  publishedAt: string | null;
  caseStudyImages: Array<{
    url: string | null;
    alt: string | null;
    position: "position_1" | "position_2" | "position_3" | "position_4" | null;
  }> | null;
}>;
// Variable: WORK_QUERY
// Query: *[_type == "work" && slug.current == $slug][0]{    _id,    layout,    slug,    title,    captions,    coverImage{        ...,        asset->{          _id,          url,          mimeType,          metadata {            lqip,            dimensions {              width,              height            }          }        },        alt    },    description,    caseStudyImages[]{        ...,        asset->{          _id,          url,          mimeType,          metadata {            lqip,            dimensions {              width,              height            }          }        },        alt,        position    },    liveLink,    collabs,    accolades,    publishedAt,    _createdAt,    _updatedAt,    meta_title,    meta_description,    noindex,    ogImage {      asset->{        _id,        url,        metadata {          dimensions {            width,            height          }        }      },    }  }
export type WORK_QUERYResult = {
  _id: string;
  layout: "layout_p" | "layout_s" | null;
  slug: Slug | null;
  title: string | null;
  captions: Array<string> | null;
  coverImage: {
    asset: {
      _id: string;
      url: string | null;
      mimeType: string | null;
      metadata: {
        lqip: string | null;
        dimensions: {
          width: number | null;
          height: number | null;
        } | null;
      } | null;
    } | null;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt: string | null;
    _type: "image";
  } | null;
  description: string | null;
  caseStudyImages: Array<{
    asset: {
      _id: string;
      url: string | null;
      mimeType: string | null;
      metadata: {
        lqip: string | null;
        dimensions: {
          width: number | null;
          height: number | null;
        } | null;
      } | null;
    } | null;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt: string | null;
    position: "position_1" | "position_2" | "position_3" | "position_4" | null;
    _type: "image";
    _key: string;
  }> | null;
  liveLink: string | null;
  collabs: Array<string> | null;
  accolades: Array<string> | null;
  publishedAt: string | null;
  _createdAt: string;
  _updatedAt: string;
  meta_title: string | null;
  meta_description: string | null;
  noindex: boolean | null;
  ogImage: {
    asset: {
      _id: string;
      url: string | null;
      metadata: {
        dimensions: {
          width: number | null;
          height: number | null;
        } | null;
      } | null;
    } | null;
  } | null;
} | null;
// Variable: WORKS_SLUGS_QUERY
// Query: *[_type == "work" && defined(slug.current)]{    "slug": slug.current  }
export type WORKS_SLUGS_QUERYResult = Array<{
  slug: string | null;
}>;

// Query TypeMap
import "@sanity/client";
declare module "@sanity/client" {
  interface SanityQueries {
    "*[_type == \"work\" && defined(slug.current)] | order(publishedAt desc){\n    _id,\n    hoverColor,\n    title,\n    slug,\n    \"coverImageUrl\": coverImage.asset->url,\n    \"coverImageAlt\": coverImage.alt,\n    description,\n    publishedAt,\n    \"caseStudyImages\": caseStudyImages[]{\n      \"url\": asset->url,\n      \"alt\": alt,\n      \"position\": position\n    }\n  }": WORKS_QUERYResult;
    "*[_type == \"work\" && slug.current == $slug][0]{\n    _id,\n    layout,\n    slug,\n    title,\n    captions,\n    coverImage{\n        ...,\n        asset->{\n          _id,\n          url,\n          mimeType,\n          metadata {\n            lqip,\n            dimensions {\n              width,\n              height\n            }\n          }\n        },\n        alt\n    },\n    description,\n    caseStudyImages[]{\n        ...,\n        asset->{\n          _id,\n          url,\n          mimeType,\n          metadata {\n            lqip,\n            dimensions {\n              width,\n              height\n            }\n          }\n        },\n        alt,\n        position\n    },\n    liveLink,\n    collabs,\n    accolades,\n    publishedAt,\n    _createdAt,\n    _updatedAt,\n    meta_title,\n    meta_description,\n    noindex,\n    ogImage {\n      asset->{\n        _id,\n        url,\n        metadata {\n          dimensions {\n            width,\n            height\n          }\n        }\n      },\n    }\n  }": WORK_QUERYResult;
    "*[_type == \"work\" && defined(slug.current)]{\n    \"slug\": slug.current\n  }": WORKS_SLUGS_QUERYResult;
  }
}
