export type ItemType = {
    id?: string; // Optional for default components, required for instances
    label?: string; // Optional for default components
    type: string; // e.g., 'row', 'col', 'image', 'button'
    addable?: boolean; // Only in default options
  settings?: {
    style?: Record<string, any>;
    content?: Record<string, any>;
    responsive?: Record<string, any>;
  };
    children?: Array<ItemType>; // For nested structures like row > col > component
};

export type OrderType = 'middle' | 'last';

export type OnDropType = (
  source: ItemType,
  destination: ItemType,
  order?: OrderType
) => void;
