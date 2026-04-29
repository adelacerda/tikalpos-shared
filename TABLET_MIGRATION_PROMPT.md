# Prompt para Migración de Tipos en tikalpos-tablet

**Objetivo:**
Revisar el proyecto `tikalpos-tablet` para asegurar que todos los tipos utilizados sean extraídos de `tikalpos-shared`, configurar el uso de `tikalpos-shared` local durante desarrollo y la versión de npm en producción, y normalizar enums a mayúsculas para consistencia con el backend.

## Contexto

Ya se completó una migración similar en `tikalpos-backend` y `tikalpos-web` que incluyó:
- Creación de nuevos tipos en `tikalpos-shared` (reservation.ts, extensión de loyalty.ts, fel.ts)
- Normalización de todos los enums a mayúsculas
- Configuración de npm link para desarrollo local
- Actualización de imports para usar tipos desde `@tikalpos/shared`
- Migración de schema.prisma en backend

`tikalpos-tablet` es una app móvil React Native + Expo que replica el POS de tikalpos-web para iPad + Android tablets.

## Contexto Específico de tikalpos-tablet

**Stack:**
- React Native + Expo
- expo-sqlite (SQLite local para offline-first)
- Zustand (state management)
- NativeWind (Tailwind CSS para React Native)
- @tikalpos/shared (tipos compartidos)

**Características principales:**
- Offline-first con SQLite DB local
- Sync usando endpoints /sync/push + /sync/pull del backend
- Screens: Tables, POS, Retail POS, Checks, Kitchen KDS, Bar KDS, Pickup, Host/Waiter
- External payments inicialmente, lectores de tarjetas integrados después
- Impresión de recibos (Bluetooth + red)
- Sin secciones de admin inicialmente
- Speed to market es crítico

**Archivos existentes:**
- PLANNING.md en c:\Coding\tikalpos-tablet\PLANNING.md
- db/schema.ts (schema de expo-sqlite)
- stores/ (Zustand stores)
- hooks/ (custom hooks)
- i18n/ (internacionalización)

## Instrucciones para la Sesión

### Fase 1: Análisis de tikalpos-tablet

1. **Identificar tipos existentes en tikalpos-tablet:**
   - Buscar definiciones de tipos/interfaces en `app/`, `components/`, `db/`, `stores/`
   - Identificar tipos duplicados con `tikalpos-shared`
   - Clasificar tipos por categoría (API, dominio, internos, UI)

2. **Verificar uso actual de @tikalpos/shared:**
   - Revisar package.json para ver si @tikalpos-shared está en dependencies
   - Buscar imports existentes desde @tikalpos/shared
   - Identificar archivos que deberían usar tipos de shared pero no lo hacen

3. **Revisar schema de expo-sqlite:**
   - Analizar `db/schema.ts` para entender el modelo de datos local
   - Identificar tipos que podrían venir de shared
   - Verificar consistencia con schema de backend (Prisma)

### Fase 2: Configuración de Desarrollo Local

1. **Configurar tikalpos-tablet para usar @tikalpos-shared local:**
   - Agregar scripts en package.json:
     - `dev:link-shared`: "npm link @tikalpos/shared"
     - `dev:unlink-shared`: "npm unlink @tikalpos/shared"
   - Asegurar que @tikalpos-shared esté en dependencies

2. **Configurar workflow de desarrollo:**
   - En tikalpos-shared: `npm link`
   - En tikalpos-tablet: `npm link @tikalpos/shared`
   - Para producción: `npm install @tikalpos-shared@latest`

### Fase 3: Actualización de Imports

1. **Actualizar archivos para importar desde @tikalpos/shared:**
   - Reemplazar definiciones locales de tipos con imports desde shared
   - Tipos prioritarios para tikalpos-tablet:
     - Order (Order, OrderStatus, OrderType, OrderLineItem, OrderPayment, PaymentMethodType, PaymentStatus)
     - Menu (MenuItem, MenuCategory, ModifierGroup, Modifier, SelectedModifier, ComboSlot, PrepDestination, MenuItemStatus)
     - KDS (KdsTicket, KdsTicketItem, KdsTicketStatus, KdsItemStatus, SendToKdsRequest, SendToKdsResponse)
     - Table (Table, TableStatus, Reservation, ReservationStatus)
     - Sync (SyncPushRequest, SyncPullRequest, SyncChangeRecord, SyncEntityType, SyncAction)
     - Loyalty (Guest, LoyaltyTier, LoyaltyTransactionType, RewardCatalogItem)
     - API utilities (ApiResponse, ApiError, PaginationMeta, PaginationParams)

2. **Eliminar definiciones duplicadas:**
   - Remover definiciones de tipos locales que ahora vienen de shared
   - Mantener solo tipos internos específicos de tablet (UI, navigation, etc.)

3. **Actualizar schema de expo-sqlite:**
   - Alinear tipos del schema local con tipos de shared donde sea aplicable
   - Asegurar consistencia de enums con backend

### Fase 4: Normalización de Enums

1. **Verificar consistencia de enums:**
   - Asegurar que todos los enums usen mayúsculas (ej: 'OPEN' en lugar de 'open')
   - Actualizar código que use valores de enum en minúsculas
   - Verificar condiciones en componentes y stores
   - Verificar schema de expo-sqlite

2. **Enums críticos a normalizar:**
   - OrderStatus: DRAFT, OPEN, PAID, PARTIALLY_PAID, VOIDED, REFUNDED
   - OrderType: DINE_IN, TAKEOUT, DELIVERY
   - PaymentMethodType: CASH, CARD, CREDIT, DEBIT, MOBILE, GIFT_CARD, LOYALTY_POINTS
   - PaymentStatus: PENDING, COMPLETED, FAILED, REFUNDED
   - MenuItemStatus: ACTIVE, INACTIVE, OUT_OF_STOCK
   - ComboSlotType: FIXED, CHOICE
   - TableStatus: AVAILABLE, OCCUPIED, RESERVED, DIRTY
   - ReservationStatus: PENDING, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW
   - SyncEntityType: ORDER, MENU_ITEM, MODIFIER_GROUP, GUEST, LOYALTY_TRANSACTION
   - SyncAction: CREATE, UPDATE, DELETE
   - StaffRole: OWNER, MANAGER, CASHIER, SERVER, WAITER, SELLER
   - LoyaltyTier: BRONZE, SILVER, GOLD, PLATINUM
   - LoyaltyTransactionType: EARN, REDEEM, ADJUST, EXPIRE
   - KdsTicketStatus: OPEN, IN_PROGRESS, COMPLETED, VOIDED
   - KdsItemStatus: PENDING, IN_PROGRESS, READY, DELIVERED

### Fase 5: Verificación

1. **Construcción y pruebas:**
   - Ejecutar `npx expo start` o `npm run dev` en tikalpos-tablet
   - Verificar que no haya errores de TypeScript
   - Verificar que la app compile sin errores
   - Probar screens principales (Tables, POS, Checks, KDS)

2. **Validación final:**
   - Todos los tipos de API pública están importados desde shared
   - No hay tipos duplicados entre tablet y shared
   - Enums están normalizados (mayúsculas)
   - tikalpos-tablet compila sin errores
   - npm link funciona correctamente para desarrollo local
   - Schema de expo-sqlite es consistente con tipos de shared

### Fase 6: Documentación

1. **Actualizar CHANGELOG.md en tikalpos-tablet:**
   - Crear CHANGELOG.md si no existe
   - Agregar entrada con fecha y hora de la sesión
   - Detallar todos los cambios realizados
   - Incluir nombre del modelo (Cascade / SWE-1.6) como autor

## Checklist de Validación

- [ ] Configuración de npm link implementada y probada
- [ ] Todos los tipos de API pública están importados desde shared
- [ ] Enums están normalizados (mayúsculas)
- [ ] No hay tipos duplicados entre tablet y shared
- [ ] tikalpos-tablet compila sin errores
- [ ] npm link funciona para desarrollo local
- [ ] Schema de expo-sqlite es consistente con tipos de shared
- [ ] CHANGELOG.md actualizado con detalles de la sesión

## Notas Importantes

- tikalpos-tablet usa React Native + Expo + TypeScript
- Revisar archivos en `app/`, `components/`, `db/`, `stores/`, `hooks/`
- Verificar configuración de Expo para asegurar compatibilidad con npm link
- Revisar si hay tipos específicos de UI/react-native que no deberían ir a shared (mantenerlos localmente)
- Considerar si hay tipos específicos de mobile que no están en shared y deberían agregarse
- El schema de expo-sqlite debe ser consistente con el schema de Prisma del backend
- Sync protocol usa tipos específicos que deben estar en shared

## Comando para Iniciar

```bash
# En tikalpos-shared
cd c:\Coding\tikalpos-shared
npm link

# En tikalpos-tablet
cd c:\Coding\tikalpos-tablet
npm link @tikalpos/shared
npx expo start
```

## Para Producción

```bash
# En tikalpos-tablet
npm install @tikalpos/shared@latest
npx expo build:android  # o build:ios
```

## Consideraciones Específicas de Tablet

- **Offline-first:** Asegurar que tipos para sync y almacenamiento local estén bien definidos
- **expo-sqlite:** El schema local debe ser consistente con tipos de shared
- **Navigation:** Tipos de navegación (React Navigation) pueden mantenerse localmente
- **NativeWind:** Tipos de estilo pueden mantenerse localmente
- **State Management:** Zustand stores deben usar tipos de shared para datos de dominio
- **i18n:** Tipos de internacionalización pueden mantenerse localmente
- **POS Features:** Asegurar que todos los tipos de POS (Order, MenuItem, Payment, etc.) vengan de shared
