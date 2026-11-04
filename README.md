Bueno ya termine el MVP, o casi, ya que aun tengo unos errores que solucionar.
He estado probando la app y me he encontrado algunos errores.
Por ejemplo al navegar a la screen de Rutinas obtengo este error:
ERROR Text strings must be rendered within a <Text> component.

Code: _layout.tsx
13 |
14 | return (

> 15 | <Tabs
> | ^
> 16 | screenOptions={{
> 17 | headerShown: false,
> 18 | tabBarActiveTintColor: activeTint,
> Call Stack
> TabLayout (src\app\(tabs)\_layout.tsx:15:5)
> RootLayoutNav (src\app\_layout.tsx:41:5)
> RootLayout (src\app\_layout.tsx:61:7)

Ademas tengo otros errores como:
POST /api/workout-sessions/start 409 6.627 ms - 154 que devuelve al backend luego de ir a la screen rutinas y dar a iniciar sesion, no funciona y lanza este error, es raro porque esto al inicio no pasaba y me funcionaba. Bueno ahora mismo me da error y no logro iniciar la rutina.
Ademas al crear un nuevo ejercicio no se adiciona aunque le de al boton de Guardar.

Y el ultimo error que vi fue este: GET /api/progress/overall 401 7.227 ms - 78 el backend me lanzo este error.
Bueno estos serian los errores mas serios que note, lo demas son detalles de diseño que puedo solventar facilmente.
