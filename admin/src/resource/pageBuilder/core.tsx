import { useEffect, useState, memo, useCallback, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useNotify, useTranslate } from 'react-admin';
import _get from 'lodash/get';

import { LoadingContainer } from '@/components/global';
import { OptionBox } from '@/components/page-builder';

import ComponentSetting from '@/components/page-builder/Component/Setting';
import {
  AnimatedComponent,
  AnimatedEmptyDropSlot,
} from '@/components/page-builder/Component/AnimationComponent';
import {
  ItemType,
  OnDropType,
} from '@/components/page-builder/Component/types';

import { GetBuilder, SaveBuilder } from '@/functions';

import Header from './Header';
import Container from './Container';
import Preview from './Preview';
import {
  FindNodeAddress,
  DeleteItem,
  AddNewItem,
  PushItem,
  AddToIndex,
  AddInside,
} from './utils';

interface StateType {
  components: Array<ItemType>;
  optionBox: boolean;
  excludeArray: Array<any>;
  sourceAddress: string;
  componentForSetting: any;
  componentOptionsBox: boolean;
}

const Core = (props) => {
  const translate = useTranslate();
  const notify = useNotify();
  const { _id, model = 'page' } = useParams();

  const [loading, setLoading] = useState(true);

  const [tabValue, setTabValue] = useState(0);
  const [editItem, setEditItem] = useState<ItemType | null>();

  const [state, setState] = useState<StateType>({
    components: [],
    optionBox: false,
    excludeArray: [],
    sourceAddress: '',
    componentForSetting: {},
    componentOptionsBox: false,
  });

  const { components, excludeArray, sourceAddress } = state;

  const LoadData = useCallback(() => {
    if (!_id) return;

    GetBuilder(model, _id)
      .then((r) => {
        const elements = _get(r, 'elements', []);
        setState((s) => ({ ...s, components: elements }));
      })
      .catch((err) => {
        console.error('err =>', err);
        notify('Some thing went Wrong!!', { type: 'error' });
      })
      .finally(() => setLoading(false));
  }, [_id, model, notify]);

  useEffect(() => {
    LoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SaveData = useCallback(
    (data = {}) => {
      setLoading(true);
      SaveBuilder(model, _id, { elements: data })
        .then((r) => {
          notify(translate('saved successfully.'), {
            type: 'success',
          });
        })
        .catch((err) => {
          console.error('err =>', err);
          notify('Some thing went Wrong!!', { type: 'error' });
        })
        .finally(() => setLoading(false));
    },
    [notify, translate, _id, model]
  );

  const toggleOptionBox = useCallback((extra) => {
    setState((s) => ({ ...s, optionBox: !s.optionBox, ...extra }));
  }, []);

  //SaveSettingsHere
    const changeComponentSetting = useCallback(
        (the_com: ItemType, updates: { content?: Record<string, any>, style?: Record<string, any> }) => {
            console.log("changeComponentSetting", the_com, updates);

            const updatedComponent = {
                ...the_com,
                settings: {
                    ...the_com.settings,
                    ...(updates.content && {
                        content: {
                            ...the_com.settings?.content,
                          ...updates?.content,
                        },
                    }),
                    ...(updates.style && {
                        style: {
                            ...the_com.settings?.style,
                          ...updates?.style,
                        },
                    }),
                },
            };

            const newComponents = components.map((comp) => {
                if (comp.id === updatedComponent.id) {
                    return updatedComponent;
                } else if (comp.children?.length) {
                    return {
                        ...comp,
                        children: comp.children.map((child) => {
                            if (child.id === updatedComponent.id) return updatedComponent;
                            if (child.children?.length) {
                                return {
                                    ...child,
                                    children: child.children.map((grandchild) =>
                                        grandchild.id === updatedComponent.id ? updatedComponent : grandchild
                                    ),
                                };
                            }
                            return child;
                        }),
                    };
                }
                return comp;
            });

            setState((s) => ({ ...s, components: newComponents }));
        },
        [components]
    );



  const handleDelete = useCallback((id) => {
    try {
      const newComponents = DeleteItem(id, components) || components;
      setState((s) => ({ ...s, components: newComponents }));
    } catch (error) {
      console.error('Delete failed:', error);
      notify('Failed to delete component', { type: 'error' });
    }
  }, [components, notify]);

  const handleAdd = useCallback(
    (item) => {
      console.log("Adding item to target:", sourceAddress);
      const newComponents = AddNewItem(sourceAddress || null, components, item);
      setState((s) => ({
        ...s,
        components: newComponents,
        optionBox: false,
      }));
    },
    [components, sourceAddress] // Keep sourceAddress dependency
  );

  // TODO: fix duplicate ids lead to error, we should regenerate ids
  const handleDuplicate = useCallback(
    (item) => {
      const newComponents = PushItem(item.id, components, item);
      setState((s) => ({ ...s, components: newComponents }));
    },
    [components]
  );

  const handleDrop = useCallback<OnDropType>(
    (source, dest, order) => {
      try {
        // 1. Find the source node path
        const sourceNodeAddress = FindNodeAddress(components, source.id);
        if (!sourceNodeAddress) {
          console.error('Source node not found');
          return;
        }

        // 2. Make a deep clone of the components array
        let newComponents = JSON.parse(JSON.stringify(components));

        // 3. Get the source node using the address
        const sourcePath = sourceNodeAddress.split(/\.|\[|\]/).filter(Boolean);
        const sourceNode = sourcePath.reduce((obj, key) => obj[key], newComponents);

        if (!sourceNode) {
          console.error('Source node could not be retrieved');
          return;
        }

        // 4. Remove from old location
        const deletePath = sourcePath.slice(0, -1); // Remove last index
        const deleteIndex = sourcePath[sourcePath.length - 1];
        const parent = deletePath.reduce((obj, key) => obj[key], newComponents);
        if (Array.isArray(parent)) {
          parent.splice(deleteIndex, 1);
        }

        // 5. Add to new location
        if (order === 'last') {
          // Add to end of root
          newComponents.push(sourceNode);
        } else if (order === 'middle') {
          // Add between root components
          const insertIndex = newComponents.findIndex(c => c.id === dest.id);
          if (insertIndex !== -1) {
            newComponents.splice(insertIndex, 0, sourceNode);
          } else {
            newComponents.push(sourceNode);
          }
        } else {
          // Add as child of destination component
          const destPath = FindNodeAddress(newComponents, dest.id);
          if (!destPath) {
            console.error('Destination node not found');
            return;
          }

          const destNode = destPath.split(/\.|\[|\]/)
            .filter(Boolean)
            .reduce((obj, key) => obj[key], newComponents);

          if (!destNode) {
            console.error('Destination node could not be retrieved');
            return;
          }

          // Ensure destination has children array
          if (!destNode.children) {
            destNode.children = [];
          }

          // Add to children
          destNode.children.push(sourceNode);
        }

        setState(p => ({ ...p, components: newComponents }));
      } catch (error) {
        console.error('Drag and drop error:', error);
        notify('Failed to move component', { type: 'error' });
      }
    },
    [components, notify]
  );
  return (
    <LoadingContainer loading={loading} className={translate('direction')}>
      <Header
        tabValue={tabValue}
        setTabValue={setTabValue}
        onAdd={() => {
          setState((p) => ({
            ...p,
            sourceAddress: '',
            excludeArray: [],
            optionBox: !p.optionBox,
          }));
        }}
        onSave={() => SaveData(components)}
      />

      <Container>
        {tabValue === 0 && (
          <AnimatePresence presenceAffectsLayout>
            {components?.map((i, idx) => (
              <Fragment key={i.id}>
                <AnimatedEmptyDropSlot
                  item={i}
                  onDropEnd={handleDrop}
                  order="middle"
                />

                <AnimatedComponent
                  animationKey={`${i.id}`}
                  index={idx}
                  item={i}
                  onDelete={handleDelete}
                  onAdd={toggleOptionBox}
                  onEdit={(v) => setEditItem(v)}
                  onDrop={handleDrop}
                  onDuplicate={handleDuplicate}
                />

                {idx === components.length - 1 ? (
                  <AnimatedEmptyDropSlot
                    item={i}
                    onDropEnd={handleDrop}
                    order="last"
                  />
                ) : null}
              </Fragment>
            ))}
          </AnimatePresence>
        )}
        {tabValue === 1 && <Preview />}
      </Container>
      <OptionBox
        {...props}
        onClose={(e) => toggleOptionBox({})}
        exclude={excludeArray}
        open={state.optionBox}
        onAdd={(item) => {
          console.log("Adding item:", item);
          handleAdd(item);
        }}
      />
      <ComponentSetting
        // @ts-ignore
        component={editItem || {}}
        open={Boolean(editItem)}
        onClose={() => setEditItem(null)}
        onSubmit={changeComponentSetting}
      />
    </LoadingContainer>
  );
};

export default memo(Core);
