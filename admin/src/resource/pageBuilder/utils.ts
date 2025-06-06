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

// export const FindNodeAddress = (item: any, id: string, path = ''): string => {
//   if (!item) return '';
//
//   // Handle array case
//   if (Array.isArray(item)) {
//     for (let i = 0; i < item.length; i++) {
//       const result = FindNodeAddress(item[i], id, `${path}[${i}]`);
//       if (result) return result;
//     }
//     return '';
//   }
//
//   // Handle object case
//   if (typeof item === 'object' && item !== null) {
//     if (item.id === id) return path;
//
//     if (Array.isArray(item.children)) {
//       for (let i = 0; i < item.children.length; i++) {
//         const result = FindNodeAddress(
//           item.children[i],
//           id,
//           `${path}${path ? '.' : ''}children[${i}]`
//         );
//         if (result) return result;
//       }
//     }
//   }
//
//   return '';
// };

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

// export const makeAction = (path: string, opt: ActionTypes, value?: any) => {
//   if (!path) return {};
//
//   const segments = getPathSegments(path);
//   let current: any = {};
//   const result = current;
//
//   segments.forEach((segment, index) => {
//     const isLast = index === segments.length - 1;
//     const isArrayIndex = !isNaN(Number(segment));
//
//     if (isArrayIndex) {
//       const arrayIndex = Number(segment);
//       if (isLast) {
//         if (opt === 'remove') {
//           current['$splice'] = [[arrayIndex, 1]];
//         } else {
//           current[arrayIndex] = getOptAction(opt, arrayIndex, value);
//         }
//       } else {
//         current[arrayIndex] = {};
//         current = current[arrayIndex];
//       }
//     } else {
//       if (isLast) {
//         current[segment] = getOptAction(opt, 0, value);
//       } else {
//         current[segment] = {};
//         current = current[segment];
//       }
//     }
//   });
//
//   return result;
// };



interface ComponentItem {
  id: string;
  label: string;
  type: string;
  settings?: any;
  children?: ComponentItem[];
}

// export const AddNewItem = (targetId: string | null, arr: any[], item: any) => {
//   // If no targetId is provided, add to root
//   if (!targetId) {
//     return update(arr, {
//       $push: [{
//         ...item,
//         children: [],
//         id: generateCompID(),
//       }]
//     });
//   }
//
//   // Find the target component
//   const address = FindNodeAddress(arr, targetId);
//   if (!address) {
//     console.warn('Target component not found, adding to root instead');
//     return update(arr, {
//       $push: [{
//         ...item,
//         children: [],
//         id: generateCompID(),
//       }]
//     });
//   }
//
//   // Add as child of the target component
//   const action = makeAction(`${address}.children`, 'push', {
//     ...item,
//     children: [],
//     id: generateCompID(),
//   });
//
//   return update(arr, action);
// };
// utils.ts with enhanced logging
export const FindNodeAddress = (item: any, id: string, path = ''): string => {
  console.group(`FindNodeAddress searching for ${id} in:`, item);
  console.log('Current path:', path);

  if (!item) {
    console.log('Item is null/undefined, returning empty string');
    console.groupEnd();
    return '';
  }

  // Handle array case
  if (Array.isArray(item)) {
    console.log('Processing array with length:', item.length);
    for (let i = 0; i < item.length; i++) {
      console.log(`Checking array index ${i}`);
      const result = FindNodeAddress(item[i], id, `${path}[${i}]`);
      if (result) {
        console.log(`Found match at array index ${i}, returning path:`, result);
        console.groupEnd();
        return result;
      }
    }
    console.log('No match found in array');
    console.groupEnd();
    return '';
  }

  // Handle object case
  if (typeof item === 'object' && item !== null) {
    console.log('Processing object:', item);
    if (item.id === id) {
      console.log(`Found matching id (${id}), returning path:`, path);
      console.groupEnd();
      return path;
    }

    if (Array.isArray(item.children)) {
      console.log('Processing children array, length:', item.children.length);
      for (let i = 0; i < item.children.length; i++) {
        const childPath = path ? `${path}.children[${i}]` : `children[${i}]`;
        console.log(`Checking child ${i} with path:`, childPath);
        const result = FindNodeAddress(item.children[i], id, childPath);
        if (result) {
          console.log(`Found match in child ${i}, returning path:`, result);
          console.groupEnd();
          return result;
        }
      }
    }
  }

  console.log('No match found in this branch');
  console.groupEnd();
  return '';
};

const makeAction = (path: string, opt: ActionTypes, value?: any) => {
  console.group('makeAction');
  console.log('Input path:', path);
  console.log('Operation:', opt);
  console.log('Value:', value);

  if (!path) {
    console.log('Empty path, returning empty object');
    console.groupEnd();
    return {};
  }

  const segments = path
    .split(/\.|\[|\]/)
    .filter(segment => segment !== '');

  console.log('Segments:', segments);

  let current: any = {};
  const result = current;

  console.log('Building action object...');
  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const isArrayIndex = !isNaN(Number(segment));

    console.group(`Processing segment ${index}: "${segment}"`);
    console.log('isLast:', isLast, 'isArrayIndex:', isArrayIndex);

    if (isArrayIndex) {
      const arrayIndex = Number(segment);
      if (isLast) {
        if (opt === 'remove') {
          console.log(`Creating $splice at index ${arrayIndex}`);
          current['$splice'] = [[arrayIndex, 1]];
        } else {
          console.log(`Creating action at array index ${arrayIndex}`);
          current[arrayIndex] = getOptAction(opt, arrayIndex, value);
        }
      } else {
        console.log(`Creating nested object at array index ${arrayIndex}`);
        current[arrayIndex] = {};
        current = current[arrayIndex];
      }
    } else {
      if (isLast) {
        console.log(`Creating final action at property "${segment}"`);
        current[segment] = getOptAction(opt, 0, value);
      } else {
        console.log(`Creating nested object at property "${segment}"`);
        current[segment] = {};
        current = current[segment];
      }
    }
    console.log('Current state:', JSON.stringify(result, null, 2));
    console.groupEnd();
  });

  console.log('Final action object:', JSON.stringify(result, null, 2));
  console.groupEnd();
  return result;
};

export const AddNewItem = (targetId: string | null, arr: any[], item: any) => {
  console.group('AddNewItem');
  console.log('Target ID:', targetId);
  console.log('Current array:', arr);
  console.log('Item to add:', item);

  // If no targetId is provided, add to root
  if (!targetId) {
    const newItem = {
      ...item,
      children: [],
      id: generateCompID(),
    };
    console.log('Adding to root:', newItem);
    const result = update(arr, { $push: [newItem] });
    console.log('Result:', result);
    console.groupEnd();
    return result;
  }

  // Find the target component
  console.log('Finding node address for:', targetId);
  const address = FindNodeAddress(arr, targetId);
  console.log('Found address:', address);

  if (!address) {
    console.warn('Target not found, adding to root instead');
    const newItem = {
      ...item,
      children: [],
      id: generateCompID(),
    };
    const result = update(arr, { $push: [newItem] });
    console.log('Result:', result);
    console.groupEnd();
    return result;
  }

  // Add as child of the target component
  const actionPath = `${address}.children`;
  console.log('Creating action for path:', actionPath);
  const action = makeAction(actionPath, 'push', {
    ...item,
    children: [],
    id: generateCompID(),
  });

  console.log('Generated action:', JSON.stringify(action, null, 2));
  const result = update(arr, action);
  console.log('Update result:', result);
  console.groupEnd();
  return result;
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