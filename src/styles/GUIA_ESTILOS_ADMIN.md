# Guía de Uso de Estilos Globales para el Área Administrativa

## Descripción
Este documento describe cómo usar correctamente el sistema de estilos globales `stylesAdmin.js` en los componentes del área administrativa.

## Estructura del Sistema de Estilos

### 1. Importación
```javascript
import adminStyles from "../../styles/stylesAdmin";
```

### 2. Mapeo de Estilos
Crear un objeto `styles` que mapee los estilos específicos del componente a los estilos globales:

```javascript
const styles = {
  pageContainer: adminStyles.containers.page,
  header: adminStyles.headerStyles.headerSimple,
  title: adminStyles.headerStyles.titleDark,
  button: {
    ...adminStyles.buttons.base,
    ...adminStyles.buttons.primary,
  },
  // ... más mappings
};
```

### 3. Estilos CSS Globales
Incluir las animaciones y estilos CSS globales:

```javascript
<style>
  {adminStyles.animations}
  {`
    .custom-class:hover {
      background-color: ${adminStyles.colors.primaryLight};
    }
  `}
</style>
```

## Principales Categorías de Estilos

### Colores
- `adminStyles.colors.primary` - Color primario principal (#0D1B2A)
- `adminStyles.colors.secondary` - Color secundario (#3498db)
- `adminStyles.colors.success` - Verde de éxito (#2ecc71)
- `adminStyles.colors.danger` - Rojo de error (#e74c3c)
- `adminStyles.colors.warning` - Amarillo de advertencia (#f39c12)

### Contenedores
- `adminStyles.containers.page` - Contenedor principal de página
- `adminStyles.containers.main` - Contenedor principal con card
- `adminStyles.containers.content` - Contenedor con padding estándar
- `adminStyles.containers.emptyState` - Estados vacíos

### Botones
- `adminStyles.buttons.base` - Estilos base para botones
- `adminStyles.buttons.primary` - Botón primario
- `adminStyles.buttons.secondary` - Botón secundario
- `adminStyles.buttons.danger` - Botón de peligro
- `adminStyles.buttons.actionButton` - Botones de acción pequeños

### Formularios
- `adminStyles.forms.input` - Inputs estándar
- `adminStyles.forms.select` - Selects estándar
- `adminStyles.forms.textarea` - Textareas
- `adminStyles.forms.uploadArea` - Área de carga de archivos
- `adminStyles.forms.formGrid` - Grid de formulario

### Tablas
- `adminStyles.tables.container` - Contenedor de tabla
- `adminStyles.tables.table` - Tabla estándar
- `adminStyles.tables.header` - Header de tabla
- `adminStyles.tables.cell` - Celdas de tabla

### Modales
- `adminStyles.modalStyles.overlay` - Overlay del modal
- `adminStyles.modalStyles.content` - Contenido del modal
- `adminStyles.modalStyles.header` - Header del modal

## Mejores Prácticas

### 1. Consistencia
- Siempre usar los colores globales en lugar de colores hardcodeados
- Mantener consistencia en espaciado usando `adminStyles.spacing`
- Usar los bordes estándar con `adminStyles.borders`

### 2. Combinación de Estilos
```javascript
// Correcto: Combinar estilos base con variantes
const buttonStyle = {
  ...adminStyles.buttons.base,
  ...adminStyles.buttons.primary,
  marginTop: adminStyles.spacing.lg,
};

// Incorrecto: Hardcodear valores
const buttonStyle = {
  padding: "12px 24px",
  backgroundColor: "#0D1B2A",
  color: "white",
};
```

### 3. Estados Interactivos
Usar las clases CSS para estados hover y focus:

```javascript
<button 
  className="hover-lift fade-in"
  style={styles.button}
>
  Mi Botón
</button>
```

### 4. Responsive Design
Usar los breakpoints definidos:

```javascript
const responsive = adminStyles.responsive(baseStyle, {
  md: { fontSize: adminStyles.typography.textLg },
  lg: { fontSize: adminStyles.typography.textXl },
});
```

## Animaciones Disponibles

### Clases CSS
- `.fade-in` - Aparición con fade
- `.slide-down` - Deslizamiento hacia abajo
- `.slide-up` - Deslizamiento hacia arriba
- `.hover-lift` - Elevación en hover
- `.hover-scale` - Escalado en hover

### Uso
```javascript
<div className="fade-in hover-lift" style={styles.card}>
  Contenido animado
</div>
```

## Migración de Componentes Existentes

### Pasos para migrar un componente:

1. **Importar el sistema de estilos**
   ```javascript
   import adminStyles from "../../styles/stylesAdmin";
   ```

2. **Crear el mapping de estilos**
   - Identificar todos los estilos del componente
   - Mapear cada estilo a su equivalente global
   - Combinar estilos base con variantes cuando sea necesario

3. **Actualizar referencias de colores hardcodeados**
   - Reemplazar hex colors con referencias a `adminStyles.colors`
   - Usar spacing consistente con `adminStyles.spacing`

4. **Agregar animaciones CSS**
   - Incluir `{adminStyles.animations}` en el tag `<style>`
   - Agregar clases de animación a elementos interactivos

5. **Verificar consistencia**
   - Verificar que no hay errores de compilación
   - Probar la funcionalidad en el navegador
   - Verificar que las animaciones funcionan correctamente

## Ejemplo Completo

```javascript
import React from 'react';
import adminStyles from "../../styles/stylesAdmin";

const MiComponente = () => {
  const styles = {
    container: adminStyles.containers.page,
    header: adminStyles.headerStyles.headerSimple,
    title: adminStyles.headerStyles.titleDark,
    button: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.primary,
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {adminStyles.animations}
        {`
          .mi-boton:hover {
            background-color: ${adminStyles.colors.primaryLight};
          }
        `}
      </style>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Mi Título</h1>
      </div>
      
      <button 
        className="mi-boton fade-in hover-lift"
        style={styles.button}
      >
        Mi Botón
      </button>
    </div>
  );
};

export default MiComponente;
```

Esta documentación debe servir como referencia para migrar otros componentes al sistema de estilos globales.
