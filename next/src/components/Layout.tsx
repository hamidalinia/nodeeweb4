// components/Layout.tsx
import BlockRenderer from './BlockRenderer';

export default function Layout({
                                   children,
                                   header,
                                   footer,
                                   className = '',
                                   modeData={
                                       mode:'light',
                                       toggleMode: () => {}
                                   }
                               }: {
    children: React.ReactNode;
    header: any;
    footer: any;
    className?: string;
    modeData:{
        mode: 'light' | 'dark';
        toggleMode: () => void;
    }
}) {
    // console.log("modeData",modeData)
    return (
        <div className={className}>
            {header?.elements && <header>
                <BlockRenderer modeData={modeData} blocks={header.elements || []} />
            </header>}

            <main>{children}</main>

            {footer?.elements && <footer>
                <BlockRenderer modeData={modeData} blocks={footer.elements || []} />
            </footer>}
        </div>
    );
}
