import Button from './blocks/Button';
import Header from './blocks/Header';
import Paragraph from './blocks/Paragraph';
import Footer from './blocks/Footer';
import Row from './blocks/Row';
import Col from './blocks/Col';
import Title from './blocks/Title';
import Hr from './blocks/Hr';
import TheImage from './blocks/TheImage';
import SearchBar from './blocks/SearchBar';
import  Navigation  from './blocks/Navigation';
import  NavigationItem  from './blocks/NavigationItem';
import  Slider  from './blocks/Slider';


type Block = {
    id: string;
    type: string;
    settings: any;
    fetchedProducts: any;
    children?: Block[];
};

type BlockRendererProps = {
    blocks: Block[];
};

export default function BlockRenderer({ blocks }: BlockRendererProps) {
    return (
        <>
            {blocks?.map(block => {
                const { id, type, settings, children } = block;



                switch (type) {
                    case 'header':
                        return <Header key={id} settings={settings} />;
                    case 'paragraph':
                        return <Paragraph key={id} settings={settings} />;
                    case 'text':
                        return <Paragraph key={id} settings={settings} />;
                    case 'footer':
                        return <Footer key={id} settings={settings} />;
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
                                <BlockRenderer blocks={children || []} />
                            </Row>
                        );
                    case 'col':
                        return (
                            <Col key={id} settings={settings}>
                                <BlockRenderer blocks={children || []} />
                            </Col>
                        );
                    case 'navigation':
                        return (
                            <Navigation key={id} settings={settings}>
                                <BlockRenderer blocks={children || []} />
                            </Navigation>
                        );
                    case 'navigationitem':
                        return (
                            <NavigationItem key={id} settings={settings}>
                                <BlockRenderer blocks={children || []} />
                            </NavigationItem>
                        );
                    case 'slider':
                        const products = block.fetchedProducts || [];
                        return (
                            <Slider key={id} settings={settings} products={products} >
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
