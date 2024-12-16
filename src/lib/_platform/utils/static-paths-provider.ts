import { promises as fs, existsSync } from 'fs';
import { StaticPath } from '@sitecore-jss/sitecore-jss-nextjs';
import { GetStaticPathsContext } from 'next';
import debug from 'lib/_platform/logging/debug-log';
import Ajv from 'ajv';

type PathReference = {
  url: string;
  locale: string;
};

type SiteReference = {
  sitename: string;
  paths: PathReference[];
};

const sitemapSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Generated schema for Root',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      sitename: {
        type: 'string',
      },
      paths: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
            },
            locale: {
              type: 'string',
            },
          },
          required: ['url', 'locale'],
        },
      },
    },
    required: ['sitename', 'paths'],
  },
};

export class StaticPathsProvider {
  /**
   * @returns {StaticPath[]} an array of static paths to generate (SSG)
   */
  async loadPaths(context: GetStaticPathsContext): Promise<StaticPath[]> {
    const staticFilePath = process.cwd() + (process.env.STATIC_PATHS_FILE || '/SSG-Prefetch.json');
    if (!existsSync(staticFilePath)) {
      throw new Error(
        'Static sitemap file not found, please check the sitemap file ' + staticFilePath
      );
    }

    //read the static file path for SSG
    const staticPathsFile: string = await fs.readFile(staticFilePath, 'utf8');

    //validate the json file against the schema
    const ajv = new Ajv();
    const sitemapValidate = ajv.compile(sitemapSchema);
    const staticSitePaths: SiteReference[] = JSON.parse(staticPathsFile);
    const isSitemapValid = sitemapValidate(staticSitePaths);

    if (!isSitemapValid) {
      debug.dataweavers('DW-SSG: Invalid sitemap file found: ', sitemapValidate.errors);
      throw new Error(
        'Invalid sitemap file found, please review the sitemap file ' + staticFilePath
      );
    }

    if (staticSitePaths && staticSitePaths.length > 0) {
      const staticPaths: StaticPath[] = [];

      staticSitePaths.forEach((site) => {
        const sitePath = '_site_' + site.sitename;

        debug.dataweavers('DW-SSG: Getting paths from file for: ' + sitePath);

        site.paths.forEach((paths: PathReference) => {
          const splitLocale = paths.locale.split(',');
          const splitPath = paths.url.split('/').filter((i) => i);

          splitLocale.forEach((locale: string) => {
            if (locale == context.defaultLocale || context.locales?.indexOf(locale)) {
              const staticPath: StaticPath = {
                params: {
                  path: [sitePath, ...splitPath],
                },
                locale: locale,
              };

              staticPaths.push(staticPath);
            } else {
              debug.dataweavers('DW-SSG: Locale not found / enabled on application: ' + locale);
            }
          });
        });
      });

      return staticPaths;
    } else {
      //log the message
      debug.dataweavers('DW-SSG: No static paths found');
    }

    return [] as StaticPath[];
  }
}

export const staticPathsProvider = new StaticPathsProvider();
