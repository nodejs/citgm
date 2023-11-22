import BufferList from 'bl';

export function npmContext(mod, packageManagers, path, options) {
  if (typeof mod === 'string') {
    mod = {
      name: mod
    };
  }
  if (!options) options = {};
  const context = {
    emit: function () {},
    path: path,
    module: mod,
    testOutput: new BufferList(),
    testError: new BufferList(),
    meta: {},
    options: options,
    npmPath: packageManagers.npm,
    yarnPath: packageManagers.yarn,
    pnpmPath: packageManagers.pnpm
  };
  return context;
}
