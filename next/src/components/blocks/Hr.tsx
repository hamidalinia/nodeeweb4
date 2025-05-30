type HRProps = {
    settings: { style?: { fields?: React.CSSProperties } };
};

export default function HR({ settings }: HRProps) {
    const style = settings?.style?.fields || {};
    // return JSON.stringify(style)
    return <hr style={style} />;
}
