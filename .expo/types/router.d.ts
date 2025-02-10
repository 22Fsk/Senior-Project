/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/home`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/create`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/explore`; params?: Router.UnknownInputParams; } | { pathname: `/tabs`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/map`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/profile`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/home`; params?: Router.UnknownOutputParams; } | { pathname: `/tabs/create`; params?: Router.UnknownOutputParams; } | { pathname: `/tabs/explore`; params?: Router.UnknownOutputParams; } | { pathname: `/tabs`; params?: Router.UnknownOutputParams; } | { pathname: `/tabs/map`; params?: Router.UnknownOutputParams; } | { pathname: `/tabs/profile`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/home${`?${string}` | `#${string}` | ''}` | `/tabs/create${`?${string}` | `#${string}` | ''}` | `/tabs/explore${`?${string}` | `#${string}` | ''}` | `/tabs${`?${string}` | `#${string}` | ''}` | `/tabs/map${`?${string}` | `#${string}` | ''}` | `/tabs/profile${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/home`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/create`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/explore`; params?: Router.UnknownInputParams; } | { pathname: `/tabs`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/map`; params?: Router.UnknownInputParams; } | { pathname: `/tabs/profile`; params?: Router.UnknownInputParams; };
    }
  }
}
