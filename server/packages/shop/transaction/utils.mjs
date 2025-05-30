export function replaceValue({
                                 data,
                                 text,
                                 boundary = '%',
                             }) {
    const values = (JSON.parse(JSON.stringify(data)))
        .map(
            (d) =>
                Object.fromEntries(
                    Object.entries(d).map(([k, v]) => [
                        `${k.toUpperCase()}`,
                        v,
                    ])
                )
        )
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    let newMsg = text;
    const pattern = new RegExp(`(${boundary}[^${boundary} ]+${boundary})`, 'ig');
    let value = pattern.exec(text);
    while (value) {
        const upperFilterV = value[0]
        ?.toUpperCase()
            .slice(boundary.length, -boundary.length);
        const target = values[upperFilterV];
        if (target) newMsg = newMsg.replace(new RegExp(value[0], 'ig'), target);
        value = pattern.exec(text);
    }
    return newMsg;
}
