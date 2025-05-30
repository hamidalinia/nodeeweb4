type HeaderProps = {
    settings: {
        text: string;
    };
};

export default function Header({ settings }: HeaderProps) {
    return <h1>{settings.text}</h1>;
}
