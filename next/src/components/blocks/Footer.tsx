type FooterProps = {
    settings: {
        text: string;
    };
};

export default function Footer({ settings }: FooterProps) {
    return <footer>{settings.text}</footer>;
}
