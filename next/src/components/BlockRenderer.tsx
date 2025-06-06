import Button from './blocks/Button';
import Header from './blocks/Header';
import Paragraph from './blocks/Paragraph';
import Row from './blocks/Row';
import Col from './blocks/Col';
import Title from './blocks/Title';
import Hr from './blocks/Hr';
import TheImage from './blocks/TheImage';
import SearchBar from './blocks/SearchBar';
import  Navigation  from './blocks/Navigation';
import  NavigationItem  from './blocks/NavigationItem';
import  ThemeMode  from './blocks/ThemeMode';
import  Slider  from './blocks/Slider';
import { Block } from '@/types/block';
//
//
// type Block = {
//     id: string;
//     type: string;
//     settings: any;
//     fetchedProducts: any;
//     fetchedPosts: any;
//     children?: Block[];
// };

type BlockRendererProps = {
    blocks: Block[];
    modeData?:{
        mode: 'light' | 'dark';
        toggleMode: () => void;
    }
};

export default function BlockRenderer({ blocks,modeData }: BlockRendererProps) {
    console.log("blocks",blocks)
    return (
        <>
            {blocks?.map(block => {
                const { id, type, settings, children } = block;


                switch (type) {
                    case 'thememode':
                        console.log("settings",settings,modeData)
                        return <ThemeMode key={id} settings={settings} modeData={modeData as { mode: 'dark' | 'light'; toggleMode: () => void }} />;
                    case 'header':
                        return <Header key={id} settings={settings} />;
                    case 'paragraph':
                        return <Paragraph key={id} settings={settings} />;
                    case 'text':
                        return <Paragraph key={id} settings={settings} />;
                    case 'hr':
                        return <Hr key={id} settings={settings} />;
                    case 'title':
                        return <Title key={id} settings={settings} />;
                    case 'button':
                        return <Button key={id} settings={settings} />;
                    case 'image':
                        return <TheImage key={id} settings={settings} />;
                    case 'searchbar':
                        return <SearchBar key={id} settings={settings} />;
                    case 'row':
                        return (
                            <Row key={id} settings={settings}>
                                <BlockRenderer blocks={children || []} modeData={modeData as { mode: 'dark' | 'light'; toggleMode: () => void }} />
                            </Row>
                        );
                    case 'col':
                        return (
                            <Col key={id} settings={settings}>
                                <BlockRenderer blocks={children || []} modeData={modeData as { mode: 'dark' | 'light'; toggleMode: () => void }} />
                            </Col>
                        );
                    case 'navigation':
                        console.log("settings",settings,children)
                        return (
                            <Navigation key={id} settings={settings}>
                                <BlockRenderer blocks={children || []} modeData={modeData as { mode: 'dark' | 'light'; toggleMode: () => void }} />
                            </Navigation>
                        );
                    case 'navigationitem':
                        return (
                            <NavigationItem key={id} settings={settings}>
                                <BlockRenderer blocks={children || []} modeData={modeData as { mode: 'dark' | 'light'; toggleMode: () => void }} />
                            </NavigationItem>
                        );
                    case 'slider':
                        const products = block.fetchedProducts || [];
                        const posts = block.fetchedPosts || [];
                        return (
                            <Slider key={id} settings={settings} products={products} posts={posts} >
                                <BlockRenderer blocks={children || []} />
                            </Slider>
                        );
                    default:
                        console.warn('Unknown block type:', type);
                        return null;
                }
            })}
        </>
    );
}
