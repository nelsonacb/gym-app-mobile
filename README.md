Qué falta para cerrar el flujo:

Pantalla de detalle del plan (app/routines/[id].tsx): usa useWorkoutPlan(id) para mostrar planExercises con sus targetSets, targetReps y restSeconds.

Botón "Iniciar sesión" en ese detalle: llama a useStartWorkoutSession() con { workoutPlanId: plan.id } y navega a app/session/[id].tsx con el session.id que devuelve el backend.

Pantalla de sesión activa: usa useWorkoutSession(id) y useUpdateSet() para registrar cada serie, y useCompleteWorkoutSession() para cerrar.

Con los tres ajustes visuales y la pantalla de Rutinas listos, el siguiente paso natural es el detalle del plan + inicio de sesión, que es lo que convierte la app de "visor de datos" en "registrador de entrenamientos".
