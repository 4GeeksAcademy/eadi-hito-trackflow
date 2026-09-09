# Regla de desarrollo TrackFlow

**Alcance:** siempre activa para cualquier archivo del monorepo.

- Mantén el idioma base de las interfaces en español y conserva los términos técnicos del dominio cuando mejoren la precisión.
- Modela el negocio con los datos del briefing: dos países, almacenes en Los Ángeles y Zaragoza, ocho transportistas y servicios de almacén, última milla y logística inversa.
- No inventes clientes, credenciales ni métricas operativas presentadas como datos reales; usa etiquetas de demo cuando los datos sean mock.
- Las aplicaciones frontend deben mantener su propio layout, estilos y configuración. Las APIs, persistencia y conectores deben crearse bajo `services/`.
- Todo cambio debe tener una validación ejecutable y no debe romper el dominio TypeScript existente.
