type HRProps = {
    settings: { style?: React.CSSProperties; };
};

export default function HR({ settings }: HRProps) {
    const style = settings?.style || {};
    // return JSON.stringify(style)
    return <hr style={style} />;
}
