# Propuesta de arquitectura backend — TrackFlow

## 1. Contexto y objetivos

TrackFlow gestiona almacenes, preparación de pedidos, entregas de última milla y devoluciones para marcas de e-commerce. Opera en dos países, con almacenes en Los Ángeles y Zaragoza, ocho transportistas y sistemas operativos actuales que no comparten una vista global del inventario.

El backend debe resolver cuatro necesidades iniciales:

- exponer una vista unificada de inventario y pedidos de ambos almacenes;
- centralizar tracking, incidencias y métricas de transportistas;
- automatizar y medir el flujo de logística inversa;
- alimentar el backoffice, el portal público y futuros agentes de IA mediante contratos API estables.

La propuesta es una guía de organización. No implementa FastAPI ni endpoints funcionales.

## 2. Patrón arquitectónico propuesto

### Monolito modular con arquitectura en capas

Se propone un **monolito modular**, organizado internamente en capas de presentación, aplicación, dominio e infraestructura. FastAPI será el adaptador HTTP del backend.

La elección está vinculada al contexto real de TrackFlow:

1. El equipo de Tecnología tiene aproximadamente siete personas. Un único servicio desplegable reduce el coste operativo, de observabilidad y de coordinación que supondrían varios microservicios.
2. La empresa necesita integrar dos SGA, un ERP antiguo y ocho APIs de transportistas. Un límite claro entre dominios y adaptadores permite aislar esas dependencias sin repartir desde el primer día despliegues, colas y bases de datos entre muchos servicios.
3. Inventario, envíos, transportistas y devoluciones tienen relaciones de negocio fuertes. Por ejemplo, una devolución depende de un envío y la selección de carrier depende de destino, peso, urgencia y país. Mantenerlos en un mismo proceso facilita transacciones y consistencia.
4. El tráfico inicial del backoffice y de los dashboards no justifica la complejidad de microservicios. Si un dominio requiere escalar o desplegarse de forma independiente, sus límites ya estarán documentados para extraerlo más adelante.

No se propone MVC como estructura principal porque mezcla con facilidad reglas de negocio, acceso a datos y controladores en una aplicación de integración compleja. Tampoco se propone serverless como patrón dominante: los conectores con SGA, ERP y carriers pueden necesitar procesos programados, reintentos, timeouts y tareas largas que conviene controlar explícitamente.

### Capas y responsabilidades

- **Presentación:** routers FastAPI, esquemas de entrada/salida, autenticación HTTP y códigos de estado. No contiene reglas de inventario o selección de carriers.
- **Aplicación:** casos de uso y orquestación, por ejemplo `GetInventory`, `RecommendCarrier` o `ApproveReturn`. Coordina repositorios y servicios externos.
- **Dominio:** entidades, value objects, reglas y puertos. Aquí viven las reglas de stock mínimo, elegibilidad de carriers, estados de envío y decisiones de devolución.
- **Infraestructura:** SQL, clientes HTTP de transportistas, adaptadores de SGA/ERP, colas, configuración, logging y observabilidad. Implementa interfaces definidas por aplicación o dominio.

## 3. Estructura propuesta del backend

El backend viviría bajo `services/trackflow-api/`, manteniendo las UIs separadas en `uis/`. Se propone organizar primero por dominio y después por responsabilidad:

```text
services/
└── trackflow-api/
	├── app/
	│   ├── main.py
	│   ├── api/
	│   │   ├── router.py
	│   │   ├── deps.py
	│   │   └── routers/
	│   │       ├── inventory.py
	│   │       ├── shipments.py
	│   │       ├── carriers.py
	│   │       ├── returns.py
	│   │       ├── analytics.py
	│   │       └── health.py
	│   ├── domains/
	│   │   ├── inventory/
	│   │   │   ├── domain.py
	│   │   │   ├── schemas.py
	│   │   │   ├── service.py
	│   │   │   └── repository.py
	│   │   ├── shipments/
	│   │   ├── carriers/
	│   │   ├── returns/
	│   │   └── analytics/
	│   ├── infrastructure/
	│   │   ├── config.py
	│   │   ├── database/
	│   │   ├── integrations/
	│   │   │   ├── warehouses/
	│   │   │   ├── carriers/
	│   │   │   └── erp/
	│   │   ├── messaging/
	│   │   └── observability/
	│   └── shared/
	│       ├── errors.py
	│       ├── pagination.py
	│       └── dates.py
	├── tests/
	│   ├── unit/
	│   ├── integration/
	│   └── contract/
	├── alembic/
	├── pyproject.toml
	└── README.md
```

### Criterio de separación

La separación primaria es por **dominio de negocio**, no por tipo global de archivo. Así, una regla de devoluciones permanece junto a sus casos de uso, esquemas y repositorio, y no se dispersa entre carpetas genéricas como `controllers/`, `models/` y `services/` sin contexto.

Los módulos no deben importar implementaciones concretas de otros módulos. La comunicación entre dominios se hará mediante casos de uso, interfaces o eventos de dominio. `shared/` queda reservado para utilidades realmente transversales; no será un cajón de sastre.

Los modelos de persistencia y los esquemas HTTP no son la misma cosa: los primeros representan almacenamiento y los segundos el contrato público. El dominio no debe depender de Pydantic ni de un proveedor concreto de base de datos si no es necesario.

## 4. Endpoints y routers FastAPI

`app/api/router.py` incluiría routers versionados bajo `/api/v1`. Cada router agrupa recursos de un dominio y aplica dependencias comunes de autenticación, tenant/cliente, paginación, tracing y manejo de errores.

### Health y operación técnica

- `GET /health/live`: proceso activo, sin comprobar dependencias externas.
- `GET /health/ready`: aplicación lista y dependencias críticas disponibles.

Se separan ambos checks para que un reinicio no se confunda con una caída de base de datos o de un conector.

### Inventario y almacenes

Router `/api/v1/inventory`:

- `GET /inventory`: consulta SKU, almacén, stock y estado, con filtros `sku`, `warehouse` y `low_stock`.
- `GET /inventory/{sku}`: detalle consolidado por almacén.
- `GET /warehouses`: almacenes configurados y estado de sincronización.
- `POST /inventory/movements`: registra o ingesta un movimiento validado.

Las respuestas deben indicar la frescura de los datos, porque Los Ángeles y Zaragoza pueden sincronizarse con sistemas distintos.

### Pedidos y última milla

Router `/api/v1/shipments`:

- `GET /shipments`: filtros por estado, país, carrier, prioridad y rango temporal.
- `GET /shipments/{shipment_id}`: detalle y línea temporal del envío.
- `POST /shipments`: crea o ingesta un envío desde una fuente autorizada.
- `POST /shipments/{shipment_id}/assign-carrier`: solicita o confirma asignación.
- `POST /shipments/{shipment_id}/tracking-events`: recibe eventos normalizados de un carrier.

Router `/api/v1/carriers`:

- `GET /carriers`: carriers disponibles filtrados por país y capacidades.
- `GET /carriers/{carrier_id}/performance`: entrega a tiempo, incidencias y coste por periodo.
- `POST /carriers/recommendations`: recomienda carrier a partir de destino, peso, urgencia y fragilidad.

### Logística inversa

Router `/api/v1/returns`:

- `GET /returns`: consulta por estado, país, cliente y rango temporal.
- `POST /returns`: registra una solicitud de devolución.
- `GET /returns/{return_id}`: detalle y decisiones del flujo.
- `POST /returns/{return_id}/decision`: aprueba o rechaza según reglas del cliente.
- `POST /returns/{return_id}/inspection`: registra inspección, reacondicionamiento o descarte.

### Analítica y vistas B2B/B2C

Router `/api/v1/analytics` para consultas de lectura, sin mezclar agregaciones con mutaciones operativas:

- `GET /analytics/facets`: rangos disponibles y distribución B2B/B2C.
- `GET /analytics/alerts`: anomalías con `threshold` y fechas.
- `GET /analytics/top-categories`: categorías principales por `operationType=B2B|B2C` y `limit`.
- `GET /analytics/executive`: KPIs consolidados por país.

Estas rutas son la evolución esperada de los contratos provisionales de `frontend/specs/`. Cuando exista OpenAPI real, sus nombres, parámetros y respuestas deberán verificarse antes de conectar las UIs.

## 5. Convenciones habituales de FastAPI investigadas

La estructura sigue convenciones comunes de proyectos FastAPI:

- `main.py` crea la instancia de FastAPI y registra el router raíz.
- Los routers se separan por recurso o dominio y se incluyen con `include_router`, prefijos y tags para generar `/docs` y `/redoc` legibles.
- Pydantic se usa para validar payloads y serializar respuestas en `schemas.py`; no se usa como sustituto automático de las entidades de dominio.
- Las dependencias compartidas se centralizan en `api/deps.py` para sesiones, autenticación y contexto de petición.
- La configuración se carga desde variables de entorno mediante un módulo dedicado, sin credenciales hardcodeadas.
- Las pruebas suelen dividirse en unitarias, integración y contrato; `TestClient`/HTTPX permite probar routers sin levantar un servidor externo.
- Migraciones de base de datos deben estar versionadas, por ejemplo con Alembic, en lugar de depender de cambios manuales.

Estas convenciones influyen en la propuesta porque mantienen la superficie HTTP fácil de descubrir, permiten que FastAPI genere documentación automáticamente y separan validación externa de reglas internas.

## 6. Frontend y backend separados

### Monorepo

Para el estado actual conviene mantener un monorepo: `uis/website`, `uis/backoffice` y `services/trackflow-api` comparten issues, documentación, contratos y reglas de entrega, mientras cada aplicación conserva su propio `package.json` o `pyproject.toml` y ciclo de despliegue.

Un repositorio separado podría ser razonable cuando existan equipos, permisos o ciclos de release muy distintos. Hoy añadiría fricción para sincronizar los contratos de analytics y los modelos de operación.

### Comunicación por API

Las UIs no acceden a la base de datos ni a los adaptadores de transportistas. Consumen HTTPS mediante API versionada, con DTOs documentados en OpenAPI. Las respuestas deben incluir errores consistentes, IDs de correlación y paginación donde corresponda.

El cliente debe configurar la URL mediante variables públicas del frontend, por ejemplo `NEXT_PUBLIC_API_BASE_URL`, sin incluir secretos. Las llamadas sensibles y credenciales de transportistas permanecen en backend.

### CORS y seguridad

- Permitir solo orígenes explícitos por entorno: desarrollo, staging y producción.
- No usar `*` con credenciales.
- Restringir métodos y headers al mínimo necesario.
- Autenticar el backoffice y aplicar autorización por rol; CORS no sustituye autenticación.
- Configurar HTTPS, timeouts, rate limits y validación de payloads.
- Registrar requests con IDs de correlación, omitiendo tokens y datos personales.

### Variables de entorno

Cada aplicación tendrá configuración por entorno fuera del repositorio: URL API, origen permitido, base de datos, claves de firma, credenciales de carriers y destinos de observabilidad. El repositorio solo debe incluir `.env.example` con nombres y valores ficticios.

## 7. Riesgos y puntos de atención

1. **Acoplamiento accidental a los sistemas legados:** si los routers llaman directamente al SGA, ERP o APIs de carriers, cambiar un proveedor romperá el dominio. Los adaptadores deben quedar en `infrastructure/integrations` y detrás de puertos.
2. **Inventario inconsistente entre países:** respuestas sin timestamp, fuente o estado de sincronización pueden inducir a operaciones erróneas. Cada lectura debe declarar frescura y estrategia de reconciliación.
3. **Reintentos duplicados:** ingestas y webhooks de transportistas pueden llegar más de una vez. Los endpoints de escritura necesitan idempotency keys o IDs de evento únicos.
4. **CORS o secretos mal configurados:** permitir todos los orígenes o enviar credenciales al frontend puede exponer el backoffice y cuentas de carriers. La configuración debe estar separada por entorno y revisarse en CI.
5. **Crecimiento prematuro de `shared/`:** poner allí reglas de negocio crea dependencias circulares y un módulo imposible de gobernar. Solo deben entrar abstracciones realmente transversales.
6. **Extracción prematura a microservicios:** dividir antes de conocer cargas y límites reales multiplica fallos de red, despliegues y observabilidad. Primero deben medirse los dominios dentro del monolito modular.

## 8. Decisión y próximos pasos

La decisión recomendada es comenzar con un monolito modular FastAPI en `services/trackflow-api`, arquitectura en capas y routers por dominio. Los próximos pasos son:

1. Confirmar contratos de analytics y de operación con el equipo de negocio.
2. Elegir persistencia y estrategia de sincronización de los dos SGA y el ERP.
3. Crear el servicio FastAPI mínimo con health checks, configuración por entorno y `/docs` protegido en entornos no públicos.
4. Verificar los tipos de `frontend/specs/` contra el OpenAPI generado y registrar incompatibilidades antes de conectar el frontend.
5. Añadir observabilidad, pruebas de contrato e idempotencia antes de habilitar ingestas reales.

