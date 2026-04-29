# Prompt para Migración de Tipos en tikalpos-web

**Objetivo:**
Revisar el proyecto `tikalpos-web` para asegurar que todos los tipos utilizados sean extraídos de `tikalpos-shared`, configurar el uso de `tikalpos-shared` local durante desarrollo y la versión de npm en producción, y normalizar enums a mayúsculas para consistencia con el backend.

## Contexto

Ya se completó una migración similar en `tikalpos-backend` que incluyó:
- Creación de nuevos tipos en `tikalpos-shared` (reservation.ts, extensión de loyalty.ts, fel.ts)
- Normalización de todos los enums a mayúsculas
- Configuración de npm link para desarrollo local
- Actualización de imports para usar tipos desde `@tikalpos/shared`
- Migración de schema.prisma en backend

## Instrucciones para la Sesión

### Fase 1: Análisis de tikalpos-web

1. **Identificar tipos existentes en tikalpos-web:**
   - Buscar definiciones de tipos/interfaces en `src/`
   - Identificar tipos duplicados con `tikalpos-shared`
   - Clasificar tipos por categoría (API, dominio, internos)

2. **Verificar uso actual de @tikalpos/shared:**
   - Revisar package.json para ver si @tikalpos-shared está en dependencies
   - Buscar imports existentes desde @tikalpos/shared
   - Identificar archivos que deberían usar tipos de shared pero no lo hacen

### Fase 2: Configuración de Desarrollo Local

1. **Configurar tikalpos-web para usar @tikalpos-shared local:**
   - Agregar scripts en package.json:
     - `dev:link-shared`: "npm link @tikalpos/shared"
     - `dev:unlink-shared`: "npm unlink @tikalpos/shared"
   - Asegurar que @tikalpos-shared esté en dependencies

2. **Configurar workflow de desarrollo:**
   - En tikalpos-shared: `npm link`
   - En tikalpos-web: `npm link @tikalpos/shared`
   - Para producción: `npm install @tikalpos-shared@latest`

### Fase 3: Actualización de Imports

1. **Actualizar archivos para importar desde @tikalpos/shared:**
   - Reemplazar definiciones locales de tipos con imports desde shared
   - Tipos prioritarios para tikalpos-web:
     - Reservation (Reservation, ReservationStatus, CreateReservationInput, UpdateReservationInput)
     - Loyalty (RewardCatalogItem, EarnPointsInput/Result, RedeemRewardInput/Result)
     - Order (Order, OrderStatus, OrderType, OrderLineItem, OrderPayment, PaymentMethodType, PaymentStatus)
     - Menu (MenuItem, MenuCategory, ModifierGroup, Modifier, SelectedModifier, ComboSlot, PrepDestination)
     - KDS (KdsTicket, KdsTicketItem, SendToKdsRequest, SendToKdsResponse)
     - Tenant (Organization, Location, Staff, Guest, LoyaltyTier)
     - Sync (SyncPushRequest, SyncPullRequest, SyncChangeRecord)
     - API utilities (ApiResponse, ApiError, PaginationMeta, PaginationParams, AuthTokenPayload)

2. **Eliminar definiciones duplicadas:**
   - Remover definiciones de tipos locales que ahora vienen de shared
   - Mantener solo tipos internos específicos de web

### Fase 4: Normalización de Enums

1. **Verificar consistencia de enums:**
   - Asegurar que todos los enums usen mayúsculas (ej: 'OPEN' en lugar de 'open')
   - Actualizar código que use valores de enum en minúsculas
   - Verificar zod schemas, validaciones, y condiciones

2. **Enums críticos a normalizar:**
   - OrderStatus: DRAFT, OPEN, PAID, PARTIALLY_PAID, VOIDED, REFUNDED
   - OrderType: DINE_IN, TAKEOUT, DELIVERY
   - PaymentMethodType: CASH, CARD, CREDIT, DEBIT, MOBILE, GIFT_CARD, LOYALTY_POINTS
   - PaymentStatus: PENDING, COMPLETED, FAILED, REFUNDED
   - MenuItemStatus: ACTIVE, INACTIVE, OUT_OF_STOCK
   - ComboSlotType: FIXED, CHOICE
   - SyncEntityType: ORDER, MENU_ITEM, MODIFIER_GROUP, GUEST, LOYALTY_TRANSACTION
   - SyncAction: CREATE, UPDATE, DELETE
   - OrganizationStatus: ACTIVE, SUSPENDED, TRIAL
   - LocationStatus: ACTIVE, INACTIVE
   - StaffRole: OWNER, MANAGER, CASHIER, SERVER, WAITER, SELLER
   - LoyaltyTier: BRONZE, SILVER, GOLD, PLATINUM
   - LoyaltyTransactionType: EARN, REDEEM, ADJUST, EXPIRE

### Fase 5: Verificación

1. **Construcción y pruebas:**
   - Ejecutar `npm run build` en tikalpos-web
   - Verificar que no haya errores de TypeScript
   - Ejecutar tests si existen
   - Verificar que la aplicación compile sin errores

2. **Validación final:**
   - Todos los tipos de API pública están importados desde shared
   - No hay tipos duplicados entre web y shared
   - Enums están normalizados (mayúsculas)
   - tikalpos-web compila sin errores
   - npm link funciona correctamente para desarrollo local

### Fase 6: Documentación

1. **Actualizar CHANGELOG.md en tikalpos-web:**
   - Agregar entrada con fecha y hora de la sesión
   - Detallar todos los cambios realizados
   - Incluir nombre del modelo (Cascade / SWE-1.6) como autor

## Checklist de Validación

- [ ] Configuración de npm link implementada y probada
- [ ] Todos los tipos de API pública están importados desde shared
- [ ] Enums están normalizados (mayúsculas)
- [ ] No hay tipos duplicados entre web y shared
- [ ] tikalpos-web compila sin errores
- [ ] npm link funciona para desarrollo local
- [ ] CHANGELOG.md actualizado con detalles de la sesión

## Notas Importantes

- tikalpos-web usa React + TypeScript + Vite
- Revisar archivos en `src/api/`, `src/components/`, `src/types/` si existen
- Verificar configuración de Vite para asegurar compatibilidad con npm link
- Revisar si hay tipos específicos de UI que no deberían ir a shared (mantenerlos localmente)
- Considerar si hay tipos de frontend específicos que no están en shared y deberían agregarse

## Comando para Iniciar

```bash
# En tikalpos-shared
cd c:\Coding\tikalpos-shared
npm link

# En tikalpos-web
cd c:\Coding\tikalpos-web
npm link @tikalpos/shared
npm run dev
```

## Para Producción

```bash
# En tikalpos-web
npm install @tikalpos-shared@latest
npm run build
```
