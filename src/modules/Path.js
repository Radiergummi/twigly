'use strict';

const normalizeCache = new Map();

class Path {
  static basename(path) {
    const normalizedPath = this.normalize(path);

    return normalizedPath.split('/').pop();
  }

  static parent(path) {
    const normalizedPath = this.normalize(path);

    const parent = normalizedPath.substring(0, normalizedPath.lastIndexOf('/'));

    return parent || '/';
  }

  static relative(firstPath, secondPath) {
    if (firstPath === secondPath) {
      return '';
    }

    let from = this.normalize(firstPath);
    let to = this.normalize(secondPath);

    if (from === to) {
      return '';
    }

    // Trim any leading slashes
    let fromStart = 1;

    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47)
        break;
    }

    let fromEnd = from.length;
    let fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    let toStart = 1;

    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47)
        break;
    }

    let toEnd = to.length;
    let toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;

    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47) {

            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {

            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47) {

            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {

            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }

      let fromCode = from.charCodeAt(fromStart + i);
      let toCode = to.charCodeAt(toStart + i);

      if (fromCode !== toCode) {
        break;
      } else if (fromCode === 47) {
        lastCommonSep = i;
      }
    }

    let out = '';

    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47) {
        if (out.length === 0) {
          out += '..';
        } else {
          out += '/..';
        }
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0) {
      return out + to.slice(toStart + lastCommonSep);
    }

    toStart += lastCommonSep;

    if (to.charCodeAt(toStart) === 47) {
      ++toStart;
    }

    return to.slice(toStart);
  }

  static normalize(path = '') {
    if (normalizeCache.has(path)) {
      return normalizeCache.get(path);
    }

    const isAbsolute = this.isAbsolute(path);
    const hasTrailingSlash = path[path.length - 1] === '/';

    const segments = path.split('/');

    const normalizedSegments = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (!segment || segment === '.') {
        continue;
      }

      if (segment === '..') {
        if (normalizedSegments.length > 0) {
          normalizedSegments.pop();
        }

        continue;
      }

      normalizedSegments.push(segment);
    }

    let joinedSegments = normalizedSegments.join('/');

    if (joinedSegments && hasTrailingSlash) {
      joinedSegments += '/';
    }

    const normalizedPath = isAbsolute ? '/' + joinedSegments : './' + joinedSegments;

    normalizeCache.set(path, normalizedPath);

    return normalizedPath;
  }

  static isAbsolute(path = '') {
    return typeof path === 'string' && path.charAt(0) === '/';
  }

  static join(...segments) {
    if (segments.length === 0) {
      return '.';
    }

    const path = segments.reduce((path, segment) => {
      if (path === '') {
        path = segment;
      } else {
        path += '/' + segment;
      }

      return path;
    }, '');

    if (path === '') {
      return '.';
    }

    return this.normalize(path);
  }
}

export default Path;
