// server/packages/server/alias-loader.mjs
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';
import module from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = module.createRequire(import.meta.url);

export async function resolve(specifier, context, defaultResolve) {
    try {
        // Define your aliases
        const aliases = {
            '#c': path.resolve(__dirname, '../front')
        };

        // Check if specifier matches any alias
        const foundAlias = Object.keys(aliases).find(alias =>
            specifier.startsWith(`${alias}/`)
        );

        if (foundAlias) {
            // Resolve the actual path
            const newSpecifier = path.join(
                aliases[foundAlias],
                specifier.substring(foundAlias.length + 1)
            );

            // Try to resolve with extensions
            const resolvedPath = tryResolveWithExtensions(newSpecifier);

            // Return the resolved URL with shortCircuit flag
            return {
                url: pathToFileURL(resolvedPath).href,
                shortCircuit: true
            };
        }

        // For non-alias specifiers, use default resolution
        return defaultResolve(specifier, context, defaultResolve);
    } catch (error) {
        console.error(`Loader error: ${error.message}`);
        throw error;
    }
}

// Helper function to try different file extensions
function tryResolveWithExtensions(basePath) {
    const extensions = ['.js', '.jsx', '.mjs', '.cjs', '.json'];

    for (const ext of extensions) {
        const fullPath = `${basePath}${ext}`;
        try {
            require.resolve(fullPath);
            return fullPath;
        } catch (e) {
            // Try without extension if it has one
            if (path.extname(basePath)) {
                return basePath;
            }
        }
    }

    // Try as directory with index file
    try {
        const indexPath = path.join(basePath, 'index.js');
        require.resolve(indexPath);
        return indexPath;
    } catch (e) {
        throw new Error(`Cannot resolve ${basePath}`);
    }
}