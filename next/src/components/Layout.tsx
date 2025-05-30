// components/Layout.tsx
import BlockRenderer from './BlockRenderer';

export default function Layout({
                                   children,
                                   header,
                                   footer,
                                   className = '',
                               }: {
    children: React.ReactNode;
    header: any;
    footer: any;
    className?: string;
}) {
    return (
        <div className={className}>
            <header>
                <BlockRenderer blocks={header.elements || []} />
            </header>

            <main>{children}</main>

            <footer>
                <BlockRenderer blocks={footer.elements || []} />
            </footer>
        </div>
    );
}
