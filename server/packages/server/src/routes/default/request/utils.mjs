// export function replaceValueold({
//                                  data,
//                                  text,
//                                  boundary = '%',
//                              }) {
//     const values = (JSON.parse(JSON.stringify(data)))
//         .map(
//             (d) =>
//                 Object.fromEntries(
//                     Object.entries(d).map(([k, v]) => [
//                         `${k.toUpperCase()}`,
//                         v,
//                     ])
//                 )
//         )
//         .reduce((acc, curr) => ({ ...acc, ...curr }), {});
//
//     let newMsg = text;
//     const pattern = new RegExp(`(${boundary}[^${boundary} ]+${boundary})`, 'ig');
//     let value = pattern.exec(text);
//     console.log("values",values)
//     while (value) {
//         const upperFilterV = value[0]
//         ?.toUpperCase()
//             .slice(boundary.length, -boundary.length);
//         let target = values[upperFilterV];
//         console.log("target:", target, "Type:", typeof target, "Check:", target === undefined);
//
//         if (target === undefined || target === null) {
//             target = '';
//         }
//         if (target)
//             newMsg = newMsg.replace(new RegExp(value[0], 'ig'), target);
//         value = pattern.exec(text);
//     }
//     return newMsg;
// }

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

    console.log("values:", values);

    while (value) {
        const upperFilterV = value[0]
        ?.toUpperCase()
            .slice(boundary.length, -boundary.length);

        let target = values[upperFilterV];

        console.log("target:", target, "Type:", typeof target, "Check:", target === undefined);

        // Ensure target is always replaced, even if empty
        if (target === undefined || target === null) {
            target = '';
        }

        newMsg = newMsg.replace(new RegExp(value[0], 'ig'), target);

        value = pattern.exec(text);
    }

    return newMsg;
}
