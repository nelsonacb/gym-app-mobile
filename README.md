Hay algunas cosas que me gustaria que me ayudes a corregir
Primero me da error instalando el paquete @bryllim/workout-guide ya probe varias veces.
C:\Cosas\Proyectos\GymApp> npx expo install @bryllim/workout-guide
› Installing 1 other package using npm

> npm install --save @bryllim/workout-guide
> npm error code ECONNRESET
> npm error syscall read
> npm error errno -4077
> npm error network read ECONNRESET
> npm error network This is a problem related to network connectivity.
> npm error network In most cases you are behind a proxy or have bad network settings.
> npm error network
> npm error network If you are behind a proxy, please make sure that the 'proxy' config is set properly. See: 'npm help config'
> npm error A complete log of this run can be found in: C:\Users\Nelson\AppData\Local\npm-cache\_logs\2026-10-28T11_36_07_153Z-debug-0.log
> Error: npm install --save @bryllim/workout-guide exited with non-zero code: 4294963219
> Error: npm install --save @bryllim/workout-guide exited with non-zero code: 4294963219
> at ChildProcess.completionListener (C:\Cosas\Proyectos\GymApp\node_modules\@expo\spawn-async\build\spawnAsync.js:113:23)
> at ChildProcess.wrapper (node:events:639:12)
> at ChildProcess.emit (node:events:514:28)
> at cp.emit (C:\Cosas\Proyectos\GymApp\node_modules\cross-spawn\lib\enoent.js:34:29)
> at ChildProcess._handle.onexit (node:internal/child_process:324:12)
> ...
> at spawnAsync (C:\Cosas\Proyectos\GymApp\node_modules\@expo\spawn-async\build\spawnAsync.js:9:23)
> at NpmPackageManager.runAsync (C:\Cosas\Proyectos\GymApp\node_modules\@expo\package-manager\build\node\BasePackageManager.js:41:42)
> at C:\Cosas\Proyectos\GymApp\node_modules\@expo\package-manager\build\node\NpmPackageManager.js:37:20
> at C:\Cosas\Proyectos\GymApp\node_modules\@expo\package-manager\build\utils\spawn.js:14:34
> at process.processTicksAndRejections (node:internal/process/task_queues:104:5)

Tambien quiero que me muestres como quedan los demás hooks (use-exercises.ts, use-workout-sessions.ts, use-progress.ts, use-preferences.ts) ya implementados cada uno aunque sigan el mismo patron que ya vimos.

Ademas en useLogout me dijiste que pusiera await asyncStoragePersister.removeClient() después de tokenStorage.clear() y qc.clear(): y que importara import { asyncStoragePersister } from '../query/persister'; y dijiste exporta el persister
pero yo no tengo ese archivo con codigo en ningun lado, ayuda con esto tambien.
