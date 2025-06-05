import { Fragment, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  CloseRounded,
  EditRounded,
  ContentCopyRounded,
  AddRounded,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import {  MainUrl } from "@/functions/index";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LinkIcon from '@mui/icons-material/Link';
import { Actions, Header, Content } from './components';
import DraggableCard from './DraggableCard';
import { ItemType, OnDropType } from './types';
import { AnimatedComponent, AnimatedEmptyDropSlot } from './AnimationComponent';
import LaptopIcon from '@mui/icons-material/Laptop';
import TabletMacIcon from '@mui/icons-material/TabletMac';
export interface ComponentProps {
  index: number;
  item: ItemType;
  onDelete: (id: string) => void;
  onAdd: (payload: any) => void;
  onEdit: (item: ItemType) => void;
  onDuplicate: (item: ItemType) => void;
  onDrop: OnDropType;
  animationKey?: React.Key;
}

const Component = ({
  index,
  item,
  onDelete,
  onAdd,
  onEdit,
  onDrop,
  onDuplicate,
}: ComponentProps) => {
  return (
    <DraggableCard
      className={`cp-${item.type}`}
      canDrag
      item={item}
      onDropEnd={onDrop}>
      <Header>
        <Actions>
          {/* <IconButton title="Duplicate" onClick={() => onDuplicate(item)}>
            <ContentCopyRounded />
          </IconButton> */}
            {(item?.settings?.style?.link) && <LinkIcon/>}
            {(item?.settings?.style?.display=='none') && <VisibilityOffIcon/>}
            {(item?.settings?.responsive?.showInDesktop) && <LaptopIcon/>}
            {(item?.settings?.responsive?.showInMobile) && <TabletMacIcon/>}
          <IconButton title="Delete" onClick={() => onDelete(item.id)}>
            <CloseRounded />
          </IconButton>

          <p>{`${item.type} ${index + 1}: ${item.id}`}</p>
            {(item?.settings?.content?.label) && <p>{item?.settings?.content?.label}</p>}

          <IconButton title="Edit" onClick={() => onEdit(item)}>
            <EditRounded />
          </IconButton>

          {item.addable && (
            <IconButton
              title="Add"
              onClick={(e) => {
                let address = item.id + '_';
                let mainAddress = address.split('_');
                let update = { sourceAddress: item.id };
                if (mainAddress[4]) {
                  update['excludeArray'] = ['row'];
                } else {
                  update['excludeArray'] = [];
                }
                onAdd(update);
              }}>
              <AddRounded />
            </IconButton>
          )}
        </Actions>
      </Header>

      <Content className="content">
          {(item?.type=='image') && <img className={'pg-builder-dc'} src={MainUrl+'/'+(item?.settings?.content?.src)}/>}
          {(item?.type=='header') && <span  className={'pg-builder-dc'} style={{color:"#000"}}>{(item?.settings?.content?.text)}</span>}
          {(item?.type=='text') && <span  className={'pg-builder-dc'} style={{color:"#000"}}>{(item?.settings?.content?.text)}</span>}
          {(item?.type=='title') && <span  className={'pg-builder-dc'} style={{color:"#000"}}>{(item?.settings?.content?.text)}</span>}
          {(item?.type=='navigationitem') && <span  className={'pg-builder-dc'} style={{color:"#000"}}>{(item?.settings?.content?.text)}</span>}
          {(item?.type=='button') && <span  className={'pg-builder-dc'} style={{color:"#000"}}>{(item?.settings?.content?.text)} - {(item?.settings?.content?.action)}</span>}

        {item.addable && (
          <AnimatePresence presenceAffectsLayout>
            {item.children?.map((i, idx) => (
              <Fragment key={i.id}>
                <AnimatedEmptyDropSlot
                  item={i}
                  onDropEnd={onDrop}
                  order="middle"
                />

                <AnimatedComponent
                  animationKey={`${i.id}`}
                  index={idx}
                  item={i}
                  onEdit={(v) => onEdit(v)}
                  onDelete={onDelete}
                  onAdd={onAdd}
                  onDrop={onDrop}
                  onDuplicate={onDuplicate}
                />

                {idx === item?.children?.length - 1 ? (
                  <AnimatedEmptyDropSlot
                    item={i}
                    onDropEnd={onDrop}
                    order="last"
                  />
                ) : null}
              </Fragment>
            ))}
          </AnimatePresence>
        )}
      </Content>
    </DraggableCard>
  );
};
export default memo(Component);
