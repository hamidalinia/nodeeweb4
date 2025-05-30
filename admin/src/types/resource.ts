import { ResourceProps } from 'react-admin';

export type ResourceType = Omit<ResourceProps, 'name'> & {
  createIcon?: React.ComponentType<any>;
};
