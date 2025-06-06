// components/Layout.tsx
import { useSelector } from 'react-redux';
import BlockRenderer from './BlockRenderer';
import { RootState } from '@/store';
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
    const isMenuOpen = useSelector((state: RootState) => state.menu.isMenuOpen);
    // console.log("modeData",modeData)
    return (
        <div className={`${className} ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
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
