# Architecture Analysis

## Overview
The application follows a simple **component-based architecture**.

- ****: Entry point, renders the  component.
- ****: Root component, manages the main state (, , ) and orchestrates the main components.
- **Components:**
  - ****: Displays the header.
  - ****: Core game logic, including the grid, word validation, and input handling.
  - ****: Renders the on-screen keyboard and handles key clicks.

## State Management
- **Local State:** All state is managed within components using  and passed down as props.
- **No Global State Manager:** No Redux, MobX, or Context API used for global state.

## Data Flow
- **Unidirectional:** State flows down from  to  and .
- **Callbacks:** Child components communicate with the parent via function props (e.g., ).
