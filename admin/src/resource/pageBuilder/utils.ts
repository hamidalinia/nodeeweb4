import update from 'immutability-helper';
import _get from 'lodash/get';


const generateID = (tokenLen = 5) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tokenLen; ++i)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
const generateCompID = (tokenLen = 5) => `cp_${generateID(tokenLen)}`;

export const FindNodeAddress = (item: any, id: string, path = ''): string => {
  if (!item) return '';

  // Handle array case
  if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      const result = FindNodeAddress(item[i], id, `${path}[${i}]`);
      if (result) return result;
    }
    return '';
  }

  // Handle object case
  if (typeof item === 'object' && item !== null) {
    if (item.id === id) return path;

    if (Array.isArray(item.children)) {
      for (let i = 0; i < item.children.length; i++) {
        const result = FindNodeAddress(
          item.children[i],
          id,
          `${path}${path ? '.' : ''}children[${i}]`
        );
        if (result) return result;
      }
    }
  }

  return '';
};
type ActionTypes = 'remove' | 'push' | 'addToIndex';

const getOptAction = (t: ActionTypes, index: number, value?: any) => {
  switch (t) {
    case 'remove':
      return { $splice: [[index, 1]] };

    case 'addToIndex':
      return {
        $apply: function(x: any) {
          // Ensure x is an array
          if (!Array.isArray(x)) {
            console.warn('Expected array but got:', x);
            return x;
          }
          const start = x.slice(0, index);
          const end = x.slice(index);
          return [...start, value, ...end];
        },
      };

    case 'push':
      return { $push: [value] };

    default:
      return {};
  }
};

const getPathSegments = (path: string): string[] => {
  return path
    .split(/\.|\[|\]/)
    .filter(segment => segment !== '');
};

export const makeAction = (path: string, opt: ActionTypes, value?: any) => {
  if (!path) return {};

  const segments = getPathSegments(path);
  let current: any = {};
  const result = current;

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const isArrayIndex = !isNaN(Number(segment));

    if (isArrayIndex) {
      const arrayIndex = Number(segment);
      if (isLast) {
        if (opt === 'remove') {
          current['$splice'] = [[arrayIndex, 1]];
        } else {
          current[arrayIndex] = getOptAction(opt, arrayIndex, value);
        }
      } else {
        current[arrayIndex] = {};
        current = current[arrayIndex];
      }
    } else {
      if (isLast) {
        current[segment] = getOptAction(opt, 0, value);
      } else {
        current[segment] = {};
        current = current[segment];
      }
    }
  });

  return result;
};

interface ComponentItem {
  id: string;
  label: string;
  type: string;
  settings?: any;
  children?: ComponentItem[];
}

export const AddNewItem = (targetId: string | null, arr: any[], item: any) => {
  // If no targetId is provided, add to root
  if (!targetId) {
    return update(arr, {
      $push: [{
        ...item,
        children: [],
        id: generateCompID(),
      }]
    });
  }

  // Find the target component
  const address = FindNodeAddress(arr, targetId);
  if (!address) {
    console.warn('Target component not found, adding to root instead');
    return update(arr, {
      $push: [{
        ...item,
        children: [],
        id: generateCompID(),
      }]
    });
  }

  // Add as child of the target component
  const action = makeAction(`${address}.children`, 'push', {
    ...item,
    children: [],
    id: generateCompID(),
  });

  return update(arr, action);
};
export const AddToIndex = (id, arr, item) => {
  const address = FindNodeAddress(arr, id);
  const action = makeAction(address, 'addToIndex', item);
  return update(arr, action);
};
export const AddInside = (id: string, arr: any[], item: any) => {
  if (!id || !arr) return arr;

  let address = FindNodeAddress(arr, id);
  if (!address) return arr;

  // Ensure the target has a children array
  const target = _get(arr, address);
  if (!target.children) {
    target.children = [];
  }

  const action = makeAction(address, 'push', item);
  return update(arr, action);
};



export const DeleteItem = (id: string, arr: any[]) => {
  const newArr = JSON.parse(JSON.stringify(arr));
  const address = FindNodeAddress(newArr, id);
  if (!address) return newArr;

  const path = address.split(/\.|\[|\]/).filter(Boolean);
  const parentPath = path.slice(0, -1);
  const index = path[path.length - 1];

  if (parentPath.length === 0) {
    // Root level deletion
    newArr.splice(index, 1);
  } else {
    const parent = parentPath.reduce((obj, key) => obj[key], newArr);
    if (Array.isArray(parent)) {
      parent.splice(index, 1);
    }
  }

  return newArr;
};

// Add this helper function
export const AddAsChild = (parentId: string, arr: any[], item: any) => {
  const newArr = JSON.parse(JSON.stringify(arr));
  const address = FindNodeAddress(newArr, parentId);

  if (!address) return newArr;

  const path = address.split(/\.|\[|\]/).filter(Boolean);
  const parent = path.reduce((obj, key) => obj[key], newArr);

  if (!parent.children) {
    parent.children = [];
  }

  parent.children.push(item);
  return newArr;
};

// Update PushItem to handle child additions better
export const PushItem = (id: string, arr: any[], item: any, asChild = false) => {
  const newArr = JSON.parse(JSON.stringify(arr));

  if (!id) {
    // Push to root
    newArr.push(item);
    return newArr;
  }

  const address = FindNodeAddress(newArr, id);
  if (!address) return newArr;

  const path = address.split(/\.|\[|\]/).filter(Boolean);
  const target = path.reduce((obj, key) => obj[key], newArr);

  if (asChild) {
    if (!target.children) target.children = [];
    target.children.push(item);
  } else {
    if (Array.isArray(target)) {
      target.push(item);
    } else {
      // Default to adding as child if target isn't an array
      if (!target.children) target.children = [];
      target.children.push(item);
    }
  }

  return newArr;
};